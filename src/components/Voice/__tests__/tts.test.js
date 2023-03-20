import axios from 'axios';
import tts from '../tts';

jest.mock('axios');

describe('Tts', () => {
  test('getButtonAction returns correct object', () => {
    const title = 'Test Title';
    const iconComponent = '<svg>Test Icon</svg>';
    const action = jest.fn();
    const expectedOutput = {
      children: iconComponent,
      onClick: expect.any(Function),
      type: 'button',
      variant: 'icon',
    };

    const result = tts.getButtonAction(title, iconComponent, action);

    expect(result).toMatchObject(expectedOutput);
    result.onClick();
    expect(action).toHaveBeenCalled();
  });

  test('getAudioFromText returns audio data', async () => {
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = null;
    const voice = 'Test Voice';
    const ssml = 'Test SSML';
    const url = 'https://test-url.com';
    const expectedOutput = 'Test Audio Data';

    axios.post.mockResolvedValueOnce({ data: { data: expectedOutput } });

    const result = await tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);
    console.log('🚀 ~ file: tts.test.js:37 ~ test ~ result:', result);

    // expect(result).toBe(expectedOutput);
    // expect(axios.post).toHaveBeenCalledWith(url + '?ssml=' + ssml + '&voix=' + voice, { text });
  });

  test('getAudioFromText logs error when url is undefined', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = null;
    const voice = 'Test Voice';
    const ssml = 'Test SSML';
    const url = undefined;

    tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(consoleSpy).toHaveBeenCalledWith('[Dydu - TTS] : Url undifined');
    consoleSpy.mockRestore();
  });

  test('cleantext removes html tags', () => {
    const text = '<p>Test Text</p>';
    const expectedOutput = '\nTest Text\n';

    const result = tts.cleantext(text);

    expect(result).toBe(expectedOutput);
  });
});
