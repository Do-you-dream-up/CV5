declare module '*.png';
declare module '*.svg';
declare module '*.gif';
interface Window {
  dyduAfterLoad: () => void | null;
  dyduChatboxReady: () => void | null;
  dydu: any;
  reword: (str: string, options: any) => void;
  dyduClearPreviousInteractions: () => void;
  dyduCustomPlaceHolder: (str: string) => void;
  rewordtest: (str: string, options: any) => void;
  _dydu_lockTextField: (val: boolean) => void;
  dyduKnowledgeUploadFile: () => void;
}
