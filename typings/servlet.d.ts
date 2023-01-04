declare namespace Servlet {
  export type ChatResponseType = 'talkResponse';
  export type ChatResponseFeedbackType = 'positive' | 'negative' | 'withoutAnswer';

  export interface ChatResponseValues {
    guiAction?: Base64;
    contextId?: Base64;
    language?: Base64;
    hasProfilePicture?: boolean;
    keepPopinMinimized?: boolean;
    askFeedback?: boolean;
    knowledgeId?: number;
    typeResponse?: Base64;
    actionId?: number;
    serverTime?: number;
    botId?: Base64;
    text?: Base64;
    startLivechat?: boolean;
    human?: boolean;
    enableAutoSuggestion?: boolean;
    feedback?: ChatResponseFeedbackType;
    sidebar?: boolean;
    templateData?: Base64;
    templateName?: Base64;
    urlRedirect?: Base64;
    nextStepResponse?: any;
  }

  export interface ChatResponse {
    values: ChatResponseValues;
    type: ChatResponseType;
  }
}
