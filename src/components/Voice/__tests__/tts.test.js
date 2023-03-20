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

  test('getAudioFromText returns false becasue no urlprovided', async () => {
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = null;
    const voice = 'Damien';
    const ssml = true;
    const url = null;
    const expectedOutput = 'Test Audio Data';

    axios.post.mockResolvedValueOnce(() => Promise.resolve({ data: { data: expectedOutput } }));

    const result = await tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(result).toBe(undefined);
  });

  test('getAudioFromText with - text', async () => {
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = null;
    const voice = 'Damien';
    const ssml = true;
    const url = 'https://voicebot.doyoudreamup.com/tts';
    const expectedOutput = 'Test Audio Data';

    axios.post.mockResolvedValueOnce(() => Promise.resolve({ data: { data: expectedOutput } }));

    const result = await tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(result).toBe(undefined);
  });
  test('getAudioFromText with - templateText', async () => {
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = 'templateText';
    const voice = 'Damien';
    const ssml = true;
    const url = 'https://voicebot.doyoudreamup.com/tts';
    const expectedOutput = 'Test Audio Data';

    axios.post.mockResolvedValueOnce(() => Promise.resolve({ data: { data: expectedOutput } }));

    const result = await tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(result).toBe(undefined);
  });
  test('getAudioFromText with - templateHtml', async () => {
    const text = 'Test Text';
    const templateHtml = 'templateHtml';
    const templateText = null;
    const voice = 'Damien';
    const ssml = true;
    const url = 'https://voicebot.doyoudreamup.com/tts';
    const expectedOutput = 'Test Audio Data';

    axios.post.mockResolvedValueOnce(() => Promise.resolve({ data: { data: expectedOutput } }));

    const result = await tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(result).toBe(undefined);
  });

  test('getAudioFromText logs error when url is undefined', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const text = 'Test Text';
    const templateHtml = null;
    const templateText = null;
    const voice = 'Test Voice';
    const ssml = 'Test SSML';
    const url = 'https://voicebot.doyoudreamup.com/tts';

    tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(consoleSpy).not.toHaveBeenCalledWith('[Dydu - TTS] : Url undifined');
    consoleSpy.mockRestore();
  });

  test('getAudioFromText nothing, because text, templateHtml and templateText are null', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const text = null;
    const templateHtml = null;
    const templateText = null;
    const voice = 'Test Voice';
    const ssml = 'Test SSML';
    const url = 'https://voicebot.doyoudreamup.com/tts';

    tts.getAudioFromText(text, templateHtml, templateText, voice, ssml, url);

    expect(consoleSpy).not.toHaveBeenCalledWith('[Dydu - TTS] : Url undifined');
    consoleSpy.mockRestore();
  });

  test('cleantext removes html tags', () => {
    const text = '<p>Test Text</p>';
    const expectedOutput = '\nTest Text\n';

    const result = tts.cleantext(text);

    expect(result).toBe(expectedOutput);
  });
});
