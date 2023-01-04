declare module '*.png';
declare module '*.svg';
declare module '*.gif';
interface Window {}

declare global {
  namespace Jss {
    export interface Theme {
      background: string;
      breakpoints: any;
    }
  }
}
