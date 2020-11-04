import axios from 'axios';
import React from 'react';


export default new class Tts {

  /**
   * Return action buton
   * @param {*} tite
   * @param {*} iconName
   * @param {*} action
   */
  getButtonAction = (tite, iconName, action) => {
     const button = {
         children: <img alt={tite} src={`${process.env.PUBLIC_URL}icons/${iconName}.png`} title={tite} onClick={() => action()} />,
         type: 'button',
         variant: 'icon',
     };
     return  button;
   }

   /**
    * Text to Audio transformation API
    * @param {*} text
    * @param {*} voice
    * @param {*} ssml
    * @param {*} url
    */
   getAudioFromText = ( text, voice, ssml, url ) => {
    return axios({
        data: {text: this.cleantext(text)},
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
  /**
   * Clean up text befor audio transformation
   * @param {*} text
   */
  cleantext = (text) => text.replace(/(<([^>]+)>)/ig, '');

};
