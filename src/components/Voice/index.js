import React, { useState } from 'react';
import { isChrome, isMacOs, isWindows } from 'react-device-detect';

import Actions from '../Actions/Actions';
import Icon from '../Icon/Icon';
import PropTypes from 'prop-types';
import Stt from './stt';
import Tts from './tts';
import icons from '../../tools/icon-constants';
import io from 'socket.io-client';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useMousetrap from 'react-hook-mousetrap';
import { useTheme } from 'react-jss';

/**
 * TTS / STT
 * Speech-to-Text allows to convert sound to text by applying powerful neural network models via an API,
 * it is the reverse of Text-to-Speech that convert streaming sound to a text via API.
 */
const Voice = ({ show, t }) => {
  // Stream Audio
  let AudioContext;
  let context;
  let globalStream;
  let input;
  let processor;
  // vars
  let analyser;
  let data;
  let resultText = '';
  let silenceStart;
  let socket;
  let triggered;
  let recognition;

  const { setLocked, locked, voiceContent, setVoiceContent } = useDialog();
  const { configuration } = useConfiguration();
  const themeColor = useTheme();
  const { ssml, sttServerUrl, ttsServerUrl, voice, voiceSpace, debug = false } = configuration.Voice;

  const constraints = { audio: true };
  const silenceDelay = 3000;
  const bufferSize = 2048;
  const minDecibels = -100;

  // eslint-disable-next-line no-undef
  const [audio] = React.useState(new Audio());

  const iconMicrophon = (
    <Icon icon={icons?.microphon || ''} color={themeColor?.palette?.primary.main} alt="microphon" />
  );
  const iconPlay = <Icon icon={icons?.play || ''} color={themeColor?.palette?.primary.main} alt="play" />;
  const iconPause = <Icon icon={icons?.pause || ''} color={themeColor?.palette?.primary.main} alt="pause" />;
  const iconReplay = <Icon icon={icons?.replay || ''} color={themeColor?.palette?.primary.main} alt="replay" />;
  const iconStop = <Icon icon={icons?.stop || ''} color={themeColor?.palette?.primary.main} alt="stop" />;

  const startRecordButton = Tts.getButtonAction(t?.start, iconMicrophon, () => {
    window.dydu.ui.toggle(2);
    setTimeout(() => {
      window.dydu.voice.startRecording();
    }, 100);
  });

  const stopRecordButton = Tts.getButtonAction(t?.stop, iconStop, () =>
    isChrome ? stopRecordChrome() : stopRecording(),
  );
  const pauseMediaButton = Stt.getButtonAction(t?.pause, iconPause, () => pause());
  const playMediaButton = Stt.getButtonAction(t?.play, iconPlay, () => play());
  const replayMediaButton = Stt.getButtonAction(t?.replay, iconReplay, () => replay());
  const stopMediaButton = Stt.getButtonAction(t?.stop, iconStop, () => stop());
  const [actions, setActions] = React.useState([startRecordButton]);
  const [handelVoice, setHandelVoice] = React.useState(false);
  const [url, setUrl] = useState('');
  const [reword, setReword] = useState('');

  useMousetrap(['ctrl+m'], () => {
    if (isMacOs && !locked) {
      window.dydu.ui.toggle(2);
      setTimeout(() => {
        window.dydu.voice.startRecording();
      }, 100);
    }
  });

  useMousetrap(['ctrl+space'], () => {
    if (isWindows && !locked) {
      window.dydu.ui.toggle(2);
      setTimeout(() => {
        window.dydu.voice.startRecording();
      }, 100);
    }
  });

  window.dydu = { ...window.dydu };
  window.dydu.voice = {
    startRecording: () => (isChrome ? startRecordChrome() : startRecording()),
  };

  React.useEffect(() => {
    if (voiceContent && handelVoice) {
      const template = voiceContent.templateData
        ? JSON.parse(voiceContent.templateData)
        : { html: null, text: null, url: null };
      if (template.url && template.url !== 'null') {
        setUrl(template.url);
      }
      if (template.reword && template.reword !== 'null') {
        setReword(template.reword);
      }
      Tts.getAudioFromText(voiceContent.text, template.html, template.text, voice, ssml, ttsServerUrl).then(
        (response) => {
          audio.src = response;
          play();
        },
      );
    } else if (voiceContent) {
      const template = voiceContent.templateData
        ? JSON.parse(voiceContent.templateData)
        : { html: null, text: null, url: null };
      if (template.url && template.url !== 'null') {
        window.open(template.url, '_blank');
      }
    }
    setVoiceContent(null);
  }, [handelVoice, voiceContent]);

  audio.onended = () => {
    stop(true);
  };

  /**
   * Start recording voice and open socket connection
   */
  const startRecording = () => {
    // connection to the socket
    if (!sttServerUrl && debug) {
      console.error('[Dydu - TTS] : Url undifined');
      return;
    }
    socket = io.connect(sttServerUrl);

    socket.on('connect', () => {
      if (debug) socket.emit('join', 'Server Connected to Client');
    });

    socket.on('messages', (data) => {
      if (debug) console.log(`[Dydu] STT : '${data}'`);
    });

    // when socket recieve data from server
    socket.on('speechData', (data) => {
      silenceStart = window.performance.now();
      const dataFinal = data.results[0].isFinal;

      if (dataFinal === false) {
        resultText = data.results[0].alternatives[0].transcript;
        if (debug) console.log(resultText);
      } else if (dataFinal === true && !triggered) {
        resultText = data.results[0].alternatives[0].transcript;
        talk(resultText);
      }
    });

    setActions([stopRecordButton]);
    setLocked(true);
    socket.emit('startGoogleCloudStream', '');
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
      latencyHint: 'interactive',
    });
    analyser = context.createAnalyser();
    analyser.minDecibels = minDecibels;
    data = new Uint8Array(analyser.frequencyBinCount);
    silenceStart = window.performance.now();
    triggered = false;
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();
    recordingUntilSilence();
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      globalStream = stream;
      input = context.createMediaStreamSource(stream);
      input.connect(processor);

      processor.onaudioprocess = (e) => {
        const left = e.inputBuffer.getChannelData(0);
        const left16 = downsampleBuffer(left, 44100, 16000);
        socket.emit('binaryData', left16);
      };
    });
  };

  /**
   * Stop recording audio and close the socket connection
   */
  const stopRecording = () => {
    if (input) {
      // waited for FinalWord
      //socket.emit('endGoogleCloudStream', '')
      const track = globalStream.getTracks()[0];
      track.stop();
      resultText = '';
      input.disconnect(processor);
      processor.disconnect(context.destination);
      context.close().then(function () {
        input = null;
        processor = null;
        context = null;
        AudioContext = null;
      });
      setLocked(false);
      socket.disconnect();
      setActions([startRecordButton]);
    }
  };

  // ================= AUDIO ==========================
  /**
   * Play audio media and show stop action
   */
  const play = () => {
    audio.play();
    setActions([pauseMediaButton, stopMediaButton]);
    setLocked(true);
  };

  const replay = () => {
    audio.currentTime = 0;
    setActions([pauseMediaButton, stopMediaButton]);
    audio.play();
    setLocked(true);
  };

  /***
   * Pause audio media and show play and stop actions
   */
  const pause = () => {
    audio.pause();
    setActions([playMediaButton, stopMediaButton]);
  };
  /**
   * Stop audio media and show the record action
   */
  const stop = (isFinished) => {
    audio.pause();
    audio.remove();
    setActions([replayMediaButton, startRecordButton]);
    setLocked(false);
    setHandelVoice(false);

    if (url && isFinished) {
      window.open(url, '_blank');
      setUrl('');
    }
    if (reword && isFinished) {
      window.dydu.chat.handleRewordClicked(reword, { type: 'ask' });
      setReword('');
    }
  };

  // ================= SANTAS HELPERS =================
  /**
   * Convert buffer to 16Array
   */
  const downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      console.warn('[Dydu] STT : downsampling rate show be smaller than original sample rate');
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0;
      var count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  };

  /**
   * Detect silence function
   * @param {*} time
   */
  const recordingUntilSilence = (time) => {
    window.requestAnimationFrame(recordingUntilSilence); // we'll loop every 60th of a second to check
    analyser.getByteFrequencyData(data); // get current data
    if (data.some((v) => v)) {
      // if there is data above the given db limit
      if (triggered) {
        triggered = false;
      }
      silenceStart = time; // set it to now
    }

    if (!triggered && time - silenceStart > silenceDelay) {
      triggered = true;
      talk(resultText);
    }
  };

  // ================= CHROME CASE =================

  if (isChrome) {
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new window.SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 10;
    recognition.continuous = false;
    recognition.lang = 'fr-FR';

    recognition.onresult = function (event) {
      for (var i = event.resultIndex, len = event.results.length; i < len; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          resultText = transcript;
          if (resultText !== '') {
            const space = window.dydu.space.get();
            window.dydu.space.set(voiceSpace, { quiet: true });
            setHandelVoice(true);
            window.dydu.chat.handleRewordClicked(resultText, { type: 'ask' });
            window.dydu.space.set(space, { quiet: true });
          }
        }
      }
    };

    recognition.onend = function (event) {
      if (event.type === 'end') {
        resultText = '';
        recognition.abort();
        setLocked(false);
        setActions([startRecordButton]);
      }
    };
  }

  /**
   *
   */
  const startRecordChrome = () => {
    setActions([stopRecordButton]);
    setLocked(true);
    recognition.start();
  };
  /**
   *
   */
  const stopRecordChrome = () => {
    resultText = '';
    recognition.abort();
    setHandelVoice(false);
    setLocked(false);
    setActions([startRecordButton]);
  };

  const talk = (text) => {
    const space = window.dydu.space.get();
    window.dydu.space.set(voiceSpace, { quiet: true });
    window.dydu.chat.handleRewordClicked(text, { type: 'ask' });
    window.dydu.space.set(space, { quiet: true });
    stopRecording();
    socket.disconnect();
    setHandelVoice(true);
  };

  return show ? <Actions data-testId="dydu-voice-actions" actions={actions} className="dydu-voice-actions" /> : null;
};

export default Voice;

Voice.propTypes = {
  DialogContext: PropTypes.node,
  configuration: PropTypes.object,
  Actions: PropTypes.node,
  show: PropTypes.bool,
  t: PropTypes.any,
  iconMicrophon: PropTypes.node,
  iconPlay: PropTypes.node,
  iconPause: PropTypes.node,
  iconReplay: PropTypes.node,
  iconStop: PropTypes.node,
};
