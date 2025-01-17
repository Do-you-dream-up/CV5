import { WelcomeKnowledgeProvider, useWelcomeKnowledge } from '../WelcomeKnowledgeContext';

import { Local } from '../../tools/storage';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';

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
    },
    livechatType: {
      load: jest.fn(() => 'websocket'),
    },
  },
}));

describe('WelcomeKnowledgeProvider', () => {
  it('should not fetch welcome knowledge', async () => {
    Local.welcomeKnowledge.save = jest.fn(() => void 0);

    const { result } = renderHook(() => useWelcomeKnowledge(), { wrapper: WelcomeKnowledgeProvider });

    const talkSpy = jest.spyOn(require('../../tools/dydu'), 'talk');
    await act(async () => {
      await result.current.fetchWelcomeKnowledge('tagWelcome');
    });

    expect(talkSpy).not.toHaveBeenCalled();
    expect(Local.welcomeKnowledge.save).not.toHaveBeenCalled();
  });
});
