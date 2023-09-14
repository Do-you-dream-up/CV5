import axios from 'axios';

export default new (class Tts {
  /**
   * Return action buton
   * @param {*} title
   * @param {*} iconComponent
   * @param {*} action
   */
  getButtonAction = (title, iconComponent, action) => ({
    children: iconComponent,
    onClick: () => action(),
    type: 'button',
    variant: 'icon',
  });

  /**
   * Text to Audio transformation API
   * @param {*} text
   * @param templateHtml
   * @param templateText
   * @param templateHtml
   * @param templateText
   * @param {*} voice
   * @param {*} ssml
   * @param {*} url
   */
  getAudioFromText = (text, templateHtml, templateText, voice, ssml, url) => {
    if (!url) {
      console.error('[Dydu - TTS] : Url undifined');
      return Promise.resolve();
    }

    let textToRead = '';

    if (templateHtml && templateHtml !== 'null') {
      textToRead = templateHtml;
    } else if (templateText && templateText !== 'null') {
      textToRead = this.cleantext(templateText);
    } else if (text && text !== 'null') {
      textToRead = this.cleantext(text);
    } else {
      return Promise.resolve();
    }

    return axios({
      data: { text: textToRead },
      headers: {
        'Content-Type': 'application/json',
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
  cleantext = (text) => text.replace(/(<([^>]+)>)/gi, '\n');
})();
