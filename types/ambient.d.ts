declare module '*.png';
declare module '*.svg';
declare module '*.gif';
interface Window {
  dyduAfterLoad: () => void | null;
  dydu: any;
}
