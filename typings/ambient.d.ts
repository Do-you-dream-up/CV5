declare module '*.png';
declare module '*.svg';
declare module '*.gif';
interface Window {
  dyduAfterLoad: any;
}

declare global {
  namespace Jss {
    export interface Theme {
      background: string;
      breakpoints: any;
    }
  }
}
