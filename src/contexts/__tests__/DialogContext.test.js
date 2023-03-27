import { DialogContext, DialogProvider, useDialog } from '../DialogContext';

import { render } from '../../tools/test-utils';

const DialogContextValuesMock = {
  closeSecondary: jest.fn(),
  openSecondary: jest.fn(),
  topList: [],
  showAnimationOperatorWriting: jest.fn(),
  displayNotification: jest.fn(),
  lastResponse: {
    guiAction: '',
    contextId: 'contexId',
    language: 'fr',
    hasProfilePicture: true,
    keepPopinMinimized: false,
    askFeedback: true,
    knowledgeId: 'knowledgeId',
    actionId: '000001',
    serverTime: 'XXXX-XX-XX',
    botId: 'botId',
    text: 'text',
    startLivechat: false,
    human: false,
    enableAutoSuggestion: true,
    feedback: 'positive',
    sidebar: false,
    templateData: 'Base64 | string',
    templateName: '',
    urlRedirect: '',
    nextStepResponse: '',
    date: new Date(),
    from: '',
    type: 'talkResponse',
    typeResponse: 'talkResponse',
    user: 'xxxxxxxx',
  },
  add: jest.fn(),
  addRequest: jest.fn(),
  addResponse: jest.fn(),
  disabled: false,
  empty: jest.fn(),
  interactions: '',
  locked: false,
  placeholder: null,
  prompt: '',
  secondaryActive: false,
  secondaryContent: null,
  setDisabled: jest.fn(),
  setLocked: jest.fn(),
  setPlaceholder: jest.fn(),
  setPrompt: jest.fn(),
  setSecondary: jest.fn(),
  setVoiceContent: jest.fn(),
  toggleSecondary: jest.fn(),
  typeResponse: 'talkResponse',
  voiceContent: null,
  zoomSrc: null,
  setZoomSrc: jest.fn(),
  autoSuggestionActive: true,
  setAutoSuggestionActive: jest.fn(),
  callWelcomeKnowledge: () => null,
};

describe('DialogContext', () => {
  test('should provide dialog context', () => {
    const MockComponent = () => {
      const dialog = useDialog();
      dialog.add('test message');
      expect(dialog.add).toHaveBeenCalled();
      expect(dialog.locked).toBeFalsy();
      dialog.setLocked(true);
      expect(dialog.setLocked).toHaveBeenCalledWith(true);
      expect(dialog.prompt).toBe('');
      dialog.setPrompt('test prompt');
      expect(dialog.setPrompt).toHaveBeenCalledWith('test prompt');
      dialog.displayNotification('test notification');
      expect(dialog.displayNotification).toHaveBeenCalledWith('test notification');
      return null;
    };
    render(
      <DialogProvider>
        <DialogContext.Provider value={DialogContextValuesMock}>
          <MockComponent />
        </DialogContext.Provider>
      </DialogProvider>,
    );
  });
});
