import axios from 'axios';

const  getAudioFromText = ( text, voice, ssml, url ) => {
    return axios({
        data: {text: cleantext(text)},
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        url: `${url}?ssml=${ssml}&voix=${voice}`,
      })
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {
        console.error('[Dydu - TTS] : ' + error);
      });
};

const cleantext = (text) => text.replace(/(<([^>]+)>)/ig, '');

export { getAudioFromText };
