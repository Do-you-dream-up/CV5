import c from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import Dydu from '../../tools/dydu';
import { Cookie } from '../../tools/storage';
import Stt from '../../tools/stt';
import talk from '../../tools/talk';
import Tts from '../../tools/tts';
import Actions from '../Actions';
import useStyles from './styles';

/**
 * TTS / STT
 * Speech-to-Text allows to convert sound to text by applying powerful neural network models via an API,
 * it is the reverse of Text-to-Speech that convert streaming sound to a text via API.
 */
export default function Voice() {

    // Stream Audio
    let AudioContext,
    context,
    globalStream,
    input,
    processor,
    //vars
    analyser,
    data,
    resultText = '',
    silenceStart,
    socket,
    triggered;

  const { configuration } = useContext(ConfigurationContext);
  const { addRequest, addResponse, setLocked, text } = useContext(DialogContext);
  const { ssml, sttServerUrl, ttsServerUrl, voice, voiceSpace } = configuration.Voice;
  const qualification = !!configuration.application.qualification;
  const classes = useStyles({ configuration });
  const { t } = useTranslation('translation');
  const recordStart = t('input.actions.record.start');
  const recordStop = t('input.actions.record.stop');
  const mediaPlay = t('input.actions.media.play');
  const mediaStop = t('input.actions.media.stop');
  const mediaPause = t('input.actions.media.pause');
  const constraints = { audio: true };
  const silenceDelay = 2500;
  const bufferSize = 2048;
  const minDecibels = -100;
  const [audio] = useState(new Audio());
  const startRecordButton = Tts.getButtonAction(recordStart, 'dydu-microphone-black.svg', () => startRecording());
  const stopRecordButton = Tts.getButtonAction(recordStop, 'dydu-stop-black.svg', () => stopRecording());
  const pauseMediaButton = Stt.getButtonAction(mediaPause, 'dydu-pause-black.svg', () => pause());
  const playMediaButton = Stt.getButtonAction(mediaPlay, 'dydu-play-black.svg', () => play());
  const stopMediaButton = Stt.getButtonAction(mediaStop, 'dydu-stop-black.svg', () => stop());
  const [actions, setActions] = useState([startRecordButton]);
  const [handelVoice, setHandelVoice] = useState(false);

  useEffect(() => {
    if (text.trim() !== '' && handelVoice) {
      Tts.getAudioFromText(text, voice, ssml, ttsServerUrl).then(response => {
        audio.src = response;
        play();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handelVoice, text]);

  audio.onended = () => {
    stop();
  };


  /**
   * Start recording voice and open socket connection
   */
  const startRecording = () => {

    //connection to the socket
    if (!sttServerUrl) {
      console.error('[Dydu - TTS] : Url undifined');
      return;
    }
    socket = io.connect(sttServerUrl);

    socket.on('connect', () => {
      socket.emit('join', 'Server Connected to Client');
    });

    socket.on('messages', (data) => {
      console.log(`[Dydu] STT : '${data}'`);
    });

    // when socket recieve data from server
    socket.on('speechData', (data) => {
      silenceStart = window.performance.now();
      const dataFinal = data.results[0].isFinal;

      if (dataFinal === false) {
        resultText = data.results[0].alternatives[0].transcript;
      }
      else if (dataFinal === true) {
        const space = Dydu.getSpace();
        resultText = data.results[0].alternatives[0].transcript;
        Dydu.setSpace(voiceSpace);
        addRequest(resultText);
        Dydu.setSpace(space);
        talk(resultText, {qualification}).then(addResponse);
        stopRecording();
        socket.disconnect();
        setHandelVoice(true);
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
      socket.emit('endGoogleCloudStream', '');
      let track = globalStream.getTracks()[0];
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
    }
    setActions([startRecordButton]);
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
  const stop = () => {
    audio.pause();
    audio.remove();
    setActions([startRecordButton]);
    setLocked(false);
    setHandelVoice(false);
  };

  // ================= SANTAS HELPERS =================
  /**
   * Convert buffer to 16Array
   */
  const downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
    if (outSampleRate == sampleRate) {
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
      var accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
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
    if (data.some(v => v)) {
      // if there is data above the given db limit
      if (triggered) {
        triggered = false;
      }
      silenceStart = time; // set it to now
    }

    if (!triggered && time - silenceStart > silenceDelay) {
        stopRecording();
        triggered = true;
      }
  };

  return (
    !!Cookie.get(Cookie.names.gdpr) && <Actions actions={actions} className={c('dydu-voice-actions', classes.root, classes.actions)} />
  );
}
