import c from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import talk from '../../tools/talk';
import { getAudioFromText } from '../../tools/tts';
import Actions from '../Actions';
import useStyles from './styles';

/**
 *
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
  const { addRequest, addResponse, setLocked, setText, text } = useContext(DialogContext);
  const qualification = !!configuration.application.qualification;
  const classes = useStyles({ configuration });
  const { t } = useTranslation('input');
  const { ssml, sttServerUrl, ttsServerUrl, voice } = configuration.SpeechToText;
  const actionStart = t('actions.record.start');
  const actionStop = t('actions.record.stop');
  const constraints = { audio: true };
  const silenceDelay = 2500;
  const bufferSize = 2048;
  const minDecibels = -100;
  const action  = { type: 'button', variant: 'icon' };
  const [audio] = useState(new Audio());

  useEffect(() => {
    if (text.trim()) {
      getAudioFromText(text, voice, ssml, ttsServerUrl).then(response => {
        audio.src = response;
        play();
      });
      setText('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  audio.onended = () => {
    stop();
    audio.currentTime = 0.0;
  };

  const startRecordButton = {
    ...action,
    children: <img alt={actionStart} src="icons/micro.black.png" title={actionStart} onClick={() => startRecording()} />,
  };

  const stopRecordButton = {
    ...action,
    children: <img alt={actionStop} src="icons/stop.black.png" title={actionStop} onClick={() => stopRecording()} />,
  };

  const pauseAudioButton = {
    ...action,
    children: <img alt={actionStop} src="icons/pause.black.png" title={actionStop} onClick={() => pause()} />,
  };

  const playAudioButton = {
    ...action,
    children: <img alt={actionStop} src="icons/play.black.png" title={actionStop} onClick={() => play()} />,
  };

  const stopAudioButton = {
    ...action,
    children: <img alt={actionStop} src="icons/stop.black.png" title={actionStop} onClick={() => stop()} />,
  };

  const [actions, setActions] = useState([startRecordButton]);

  // ================= RECORDING ======================
  const startRecording = () => {
    socket = io.connect(sttServerUrl);
    socket.on('connect', () => {
      socket.emit('join', 'Server Connected to Client');
    });

    socket.on('messages', (data) => {
      console.log(`[Dydu] STT : '${data}'`);
    });

    socket.on('speechData', (data) => {
      silenceStart = window.performance.now();
      const dataFinal = data.results[0].isFinal;

      if (dataFinal === false) {
        resultText = data.results[0].alternatives[0].transcript;
        console.log(resultText);
      }
      else if (dataFinal === true) {
        resultText = data.results[0].alternatives[0].transcript;
        console.log('last', resultText);
        addRequest(resultText);
        talk(resultText, {qualification}).then(addResponse);
        stopRecording();
        socket.disconnect();
      }
    });

    setActions([stopRecordButton]);
    setLocked(true);
    socket.emit('startGoogleCloudStream', ''); //init socket Google Speech Connection
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
  const play = () => {
    audio.play();
    setActions([pauseAudioButton, stopAudioButton]);
    setLocked(true);
  };

  const pause = () => {
    audio.pause();
    setActions([playAudioButton, stopAudioButton]);
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0.0;
    setActions([startRecordButton]);
    setLocked(false);
  };

  // ================= SANTAS HELPERS =================
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
        if (resultText && resultText.length !== '') {
          console.log('onSilence', resultText);
        }
        stopRecording();
        triggered = true;
      }
  };

  return (
    <Actions actions={actions} className={c('dydu-input-actions', classes.root, classes.actions)} />
  );
}
