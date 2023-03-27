import dydu from '../../dydu';
import { renderHook } from '@testing-library/react-hooks';
import { useConfiguration } from '../../../contexts/ConfigurationContext';
import { useLivechat } from '../../../contexts/LivechatContext';
import useWelcomeKnowledge from '../useWelcomeKnowledge';

jest.mock('../../dydu');
jest.mock('../../../contexts/ConfigurationContext');
jest.mock('../../../contexts/LivechatContext');

describe('useWelcomeKnowledge', () => {
  let configuration;
  let isLivechatOn;

  beforeAll(() => {
    configuration = {
      welcome: {
        knowledgeName: 'test-knowledge',
      },
    };
    isLivechatOn = false;
  });

  beforeEach(() => {
    dydu.getWelcomeKnowledge.mockReset();
    useConfiguration.mockReturnValue({ configuration });
    useLivechat.mockReturnValue({ isLivechatOn });
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useWelcomeKnowledge());

    expect(result.current.result).toBe(null);
    expect(typeof result.current.fetch).toBe('function');
  });

  it('fetches welcome knowledge', async () => {
    const wkResponse = {
      answer: 'Hello!',
    };
    dydu.getWelcomeKnowledge.mockResolvedValue(wkResponse);

    const { result, waitForNextUpdate } = renderHook(() => useWelcomeKnowledge());

    expect(result.current.result).toBe(null);

    result.current.fetch();

    await waitForNextUpdate();

    expect(result.current.result).toEqual(wkResponse);
    expect(dydu.getWelcomeKnowledge).toHaveBeenCalledWith('test-knowledge');
  });

  it('does not fetch if result is already defined', async () => {
    const wkResponse = {
      answer: 'Hello!',
    };
    dydu.getWelcomeKnowledge.mockResolvedValue(wkResponse);

    const { result, waitForNextUpdate } = renderHook(() => useWelcomeKnowledge());

    result.current.result = wkResponse;

    result.current.fetch();

    await waitForNextUpdate();

    expect(result.current.result).toEqual(wkResponse);
    expect(dydu.getWelcomeKnowledge).toHaveBeenCalled();
  });

  it('does not fetch if livechat is on', async () => {
    const { result } = renderHook(() => useWelcomeKnowledge());

    useLivechat.mockReturnValue({ isLivechatOn: true });

    expect(result.current.result).toBe(null);
    expect(dydu.getWelcomeKnowledge).not.toHaveBeenCalled();
  });

  it('does not fetch if tag welcome is not defined', async () => {
    const { result } = renderHook(() => useWelcomeKnowledge());

    useConfiguration.mockReturnValue({ configuration: {} });

    expect(result.current.result).toBe(null);
    expect(dydu.getWelcomeKnowledge).not.toHaveBeenCalled();
  });

  it('does not fetch if knowledgeName is null', async () => {
    configuration.welcome.knowledgeName = null;

    const { result } = renderHook(() => useWelcomeKnowledge());

    expect(result.current.result).toBe(null);
    expect(dydu.getWelcomeKnowledge).not.toHaveBeenCalled();
  });

  it('does not fetch if isLivechatOn is true', async () => {
    const { result } = renderHook(() => useWelcomeKnowledge());

    useLivechat.mockReturnValue({ isLivechatOn: true });

    expect(result.current.result).toBe(null);
    expect(dydu.getWelcomeKnowledge).not.toHaveBeenCalled();
  });
});
