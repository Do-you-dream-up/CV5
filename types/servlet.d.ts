import { Base64 } from 'js-base64';

declare namespace Servlet {
  export type ChatResponseType =
    | Base64
    | 'talkResponse'
    | 'DMUnderstoodQuestion'
    | 'GBMisunderstoodQuestion'
    | 'DMDisabledKnowledge'
    | 'RWOneReword'
    | 'DMRewordClickedAuto';

  export type ChatResponseFeedbackType = 'positive' | 'negative' | 'withoutAnswer';

  export interface ChatResponseValues {
    guiAction?: Base64 | string;
    contextId?: Base64 | string;
    language?: Base64 | string;
    hasProfilePicture?: boolean;
    keepPopinMinimized?: boolean;
    askFeedback?: boolean;
    knowledgeId?: number;
    actionId?: number;
    serverTime?: number;
    botId?: Base64 | string;
    text?: Base64 | string;
    startLivechat?: boolean;
    human?: boolean;
    enableAutoSuggestion?: boolean;
    feedback?: ChatResponseFeedbackType;
    sidebar?: boolean;
    survey?: Base64 | string;
    templateData?: Base64 | string;
    templateName?: Base64 | string;
    urlRedirect?: Base64 | string;
    nextStepResponse?: any;
    date?: Date;
    from?: string;
    type?: ChatResponseType;
    typeResponse?: ChatResponseType;
    user?: string;
    isFromHistory?: boolean;
    specialAction?: Base64 | string;
    hideRequest?: boolean;
  }

  interface ChatHistoryInteractionSidebar {
    title?: Base64 | string;
    content?: Base64 | string;
    url?: Base64 | string;
    height?: number;
    width?: Base64 | string;
  }

  interface ChatHistoryInteraction {
    from?: Base64 | string;
    user?: Base64 | string;
    text?: Base64 | string;
    redirectUrl?: Base64 | string;
    operatorName?: Base64 | string;
    operatorLastName?: Base64 | string;
    operatorMail?: Base64 | string;
    operatorExternalId?: Base64 | string;
    templateName?: Base64 | string;
    templateData?: Base64 | string;
    feedBack?: Base64 | string;
    feedbackChoiceKey?: Base64 | string;
    feedbackComment?: Base64 | string;
    inputsInfo?: Base64 | string;
    type?: Base64 | string;
    sidebar?: ChatHistoryInteractionSidebar;
    date?: string;
    timestamp?: number;
    hideRequest?: boolean;
  }

  export interface ChatHistoryResponse {
    callbackFunctionName?: Base64 | string;
    html?: Base64 | string;
    mustShowFirstMessage?: boolean;
    dialog?: Base64 | string;
    interactions?: ChatHistoryInteraction[];
    livechatEnabled?: boolean;
    contextId?: Base64 | string;
    botUUID?: Base64 | string;
    saml2Assertion?: Base64 | string;
    serverTime?: number;
    pollUpdatedInteractionDate?: number;
  }

  export interface ChatResponse {
    values: ChatResponseValues;
    type: ChatResponseType;
  }
}
