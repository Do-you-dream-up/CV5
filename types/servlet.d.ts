declare namespace Servlet {
  export type ChatResponseType =
    | import('js-base64').Base64
    | 'talkResponse'
    | 'DMUnderstoodQuestion'
    | 'GBMisunderstoodQuestion'
    | 'DMDisabledKnowledge'
    | 'RWOneReword'
    | 'DMRewordClickedAuto';

  export type ChatResponseFeedbackType = 'positive' | 'negative' | 'withoutAnswer';

  export interface FeedbackWordingInterface {
    choiceIntroduction?: import('js-base64').Base64 | string;
    choice0?: import('js-base64').Base64 | string;
    choice1?: import('js-base64').Base64 | string;
    choice2?: import('js-base64').Base64 | string;
    commentLabel?: import('js-base64').Base64 | string;
    commentPlaceholder?: import('js-base64').Base64 | string;
    commentSend?: import('js-base64').Base64 | string;
    commentEnd?: import('js-base64').Base64 | string;
  }

  export interface ChatResponseValues {
    guiAction?: import('js-base64').Base64 | string;
    contextId?: import('js-base64').Base64 | string;
    language?: import('js-base64').Base64 | string;
    hasProfilePicture?: boolean;
    keepPopinMinimized?: boolean;
    askFeedback?: boolean;
    feedbackWording?: FeedbackWordingInterface;
    knowledgeId?: number;
    actionId?: number;
    serverTime?: number;
    botId?: import('js-base64').Base64 | string;
    text?: import('js-base64').Base64 | string;
    startLivechat?: boolean;
    human?: boolean;
    enableAutoSuggestion?: boolean;
    feedback?: ChatResponseFeedbackType;
    sidebar?: boolean;
    survey?: import('js-base64').Base64 | string;
    templateData?: import('js-base64').Base64 | string;
    templateName?: import('js-base64').Base64 | string;
    urlRedirect?: import('js-base64').Base64 | string;
    nextStepResponse?: any;
    date?: Date;
    from?: string;
    type?: ChatResponseType;
    typeResponse?: ChatResponseType;
    user?: string;
    isFromHistory?: boolean;
    specialAction?: import('js-base64').Base64 | string;
    hideRequest?: boolean;
  }

  interface ChatHistoryInteractionSidebar {
    title?: import('js-base64').Base64 | string;
    content?: import('js-base64').Base64 | string;
    url?: import('js-base64').Base64 | string;
    height?: number;
    width?: import('js-base64').Base64 | string;
  }

  export interface ChatHistoryInteraction {
    from?: import('js-base64').Base64 | string;
    user?: import('js-base64').Base64 | string;
    text?: import('js-base64').Base64 | string;
    redirectUrl?: import('js-base64').Base64 | string;
    operatorName?: import('js-base64').Base64 | string;
    operatorLastName?: import('js-base64').Base64 | string;
    operatorMail?: import('js-base64').Base64 | string;
    operatorExternalId?: import('js-base64').Base64 | string;
    templateName?: import('js-base64').Base64 | string;
    templateData?: import('js-base64').Base64 | string;
    feedBack?: import('js-base64').Base64 | string;
    feedbackChoiceKey?: import('js-base64').Base64 | string;
    feedbackComment?: import('js-base64').Base64 | string;
    inputsInfo?: import('js-base64').Base64 | string;
    type?: import('js-base64').Base64 | string;
    sidebar?: ChatHistoryInteractionSidebar;
    date?: string;
    timestamp?: number;
    hideRequest?: boolean;
    pollUpdatedInteractionDate?: number;
  }

  export interface ChatHistoryResponse {
    callbackFunctionName?: import('js-base64').Base64 | string;
    html?: import('js-base64').Base64 | string;
    mustShowFirstMessage?: boolean;
    dialog?: import('js-base64').Base64 | string;
    interactions?: ChatHistoryInteraction[];
    livechatEnabled?: boolean;
    contextId?: import('js-base64').Base64 | string;
    botUUID?: import('js-base64').Base64 | string;
    saml2Assertion?: import('js-base64').Base64 | string;
    serverTime?: number;
    pollUpdatedInteractionDate?: number;
  }

  export interface ChatResponse {
    values: ChatResponseValues;
    type: ChatResponseType;
  }
}
