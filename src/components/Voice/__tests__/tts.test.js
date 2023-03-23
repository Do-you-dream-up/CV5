import Tts from '../tts';
import axios from 'axios';

jest.mock('axios');

describe('Tts', () => {
  let mockData = {
    data: 'mock audio data',
  };

  beforeEach(() => {
    axios.mockClear();
  });

  describe('getButtonAction', () => {
    it('returns a button action object with the correct properties', () => {
      const title = 'Test Button';
      const iconComponent = '<svg>Mock Icon</svg>';
      const action = jest.fn();

      const result = Tts.getButtonAction(title, iconComponent, action);

      expect(result).toEqual({
        children: iconComponent,
        onClick: expect.any(Function),
        type: 'button',
        variant: 'icon',
      });
      result.onClick();
      expect(action).toHaveBeenCalled();
    });
  });

  describe('getAudioFromText', () => {
    const url = 'mockUrl';
    const text = 'mockText';
    const templateHtml = null;
    const templateText = 'mockTemplateText';
    const voice = 'mockVoice';
    const ssml = 'mockSsml';

    it('returns audio data if the request is successful', async () => {
      axios.mockResolvedValueOnce(mockData);

      const result = await Tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

      expect(axios).toHaveBeenCalledWith({
        data: { text: Tts.cleantext(templateText) },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: `${url}?ssml=${ssml}&voix=${voice}`,
      });

      expect(result).toEqual(undefined);
    });

    it('logs an error if the request fails', async () => {
      const error = new Error('mock error');
      axios.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await Tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

      expect(console.error).toHaveBeenCalledWith('[Dydu - TTS] : ' + error);
    });
  });

  describe('cleantext', () => {
    it('replaces html tags with newlines', () => {
      const input = '<p>mock text</p>';
      const expectedOutput = '\nmock text\n';

      const result = Tts.cleantext(input);

      expect(result).toEqual(expectedOutput);
    });
  });
});
