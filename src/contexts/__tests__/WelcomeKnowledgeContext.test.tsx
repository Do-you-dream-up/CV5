import { WelcomeKnowledgeProvider, useWelcomeKnowledge } from '../WelcomeKnowledgeContext';

import { Local } from '../../tools/storage';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../tools/dydu', () => ({
  getBotId: jest.fn(() => 'botId'),
  talk: jest.fn(() => Promise.resolve({ text: '#Welcome#' })),
}));

jest.mock('../../tools/storage', () => ({
  Local: {
    contextId: {
      load: jest.fn(() => 'contextId'),
    },
    welcomeKnowledge: {
      load: jest.fn(() => 'Welcome Knowledge'),
      isSet: jest.fn(() => false),
    },
    isLivechatOn: {
      load: jest.fn(() => false),
    },
    isChannels: {
      load: jest.fn(() => false),
    },
  },
}));

describe('WelcomeKnowledgeProvider', () => {
  it('should fetch and provide welcome knowledge', async () => {
    Local.welcomeKnowledge.isSet = jest.fn(() => false);
    Local.welcomeKnowledge.save = jest.fn(() => void 0);
    Local.welcomeKnowledge.isSetWithActualContextIdFromLocal = jest.fn(() => true);
    const { result } = renderHook(() => useWelcomeKnowledge(), { wrapper: WelcomeKnowledgeProvider });

    const talkSpy = jest.spyOn(require('../../tools/dydu'), 'talk');
    result.current.getWelcomeKnowledge('tagWelcome');

    await expect(talkSpy).toHaveBeenCalled();
    expect(Local.welcomeKnowledge.save).toHaveBeenCalled();
  });

  it('should fetch and provide welcome knowledge', async () => {
    Local.welcomeKnowledge.isSet = jest.fn(() => true);
    Local.welcomeKnowledge.save = jest.fn(() => void 0);
    Local.welcomeKnowledge.isSetWithActualContextIdFromLocal = jest.fn(() => true);

    const { result } = renderHook(() => useWelcomeKnowledge(), { wrapper: WelcomeKnowledgeProvider });

    const talkSpy = jest.spyOn(require('../../tools/dydu'), 'talk');
    result.current.getWelcomeKnowledge('tagWelcome');

    await expect(talkSpy).not.toHaveBeenCalled();
    expect(Local.welcomeKnowledge.save).not.toHaveBeenCalled();
  });
});
