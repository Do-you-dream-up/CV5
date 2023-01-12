declare global {
  namespace Jss {
    export interface Theme {
      font: {
        monospace: string;
        sansSerif: 'Roboto Regular' | 'Assistant' | 'sans-serif';
        serif: 'sans-serif';
      };
      palette: {
        action: {
          active: string;
          disabled: string;
          disabledBackground: string;
          hover: string;
          selected: string;
        };
        background: {
          bullet: string;
          default: string;
          dim: string;
          highlight: string;
          menu: string;
          overlay: string;
          paper: string;
          secondary: string;
          skeleton: string;
        };
        divider: string;
        error: {
          main: string;
          text: string;
        };
        primary: {
          dark: string;
          light: string;
          main: string;
          text: string;
        };
        request: {
          background: string;
          text: string;
        };
        response: {
          background: string;
          text: string;
        };
        secondary: {
          main: string;
          text: string;
        };
        success: {
          main: string;
          text: string;
        };
        text: {
          disabled: string;
          link: string;
          primary: string;
          secondary: string;
        };
        tooltip: {
          background: string;
          text: string;
        };
        warning: {
          main: string;
          text: string;
        };
      };
      shadows: string[];
      shape: {
        radius: {
          inner: number;
          outer: number;
        };
      };
    }
  }
}
