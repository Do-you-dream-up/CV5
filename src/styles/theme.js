import 'typeface-assistant';
import theme from '../../public/override/theme.json';
import breakpoints from './breakpoints';

export default {

  breakpoints,

  font: {
    monospace: theme.font.monospace || 'monospace',
    sansSerif: theme.font.sansSerif || "'Assistant', sans-serif",
    serif: theme.font.serif || 'sans-serif',
  },

  palette: {
    action: {
      active: theme.palette.action.active || 'rgba(0, 0, 0, .4)',
      disabled: theme.palette.action.disabled || 'rgba(0, 0, 0, .26)',
      disabledBackground: theme.palette.action.disabledBackground || 'rgba(0, 0, 0, .12)',
      hover: theme.palette.action.hover || 'rgba(0, 0, 0, .14)',
      selected: theme.palette.action.selected || 'rgba(0, 0, 0, .08)',
    },
    background: {
      bullet: theme.palette.background.bullet || '#A4A4A4',
      default: theme.palette.background.default || '#F5F5F5',
      dim: theme.palette.background.dim || 'rgba(0, 0, 0, .05)',
      highlight: theme.palette.background.highlight || 'rgba(0, 0, 0, .05)',
      menu: theme.palette.background.menu || '#FFFFFF',
      overlay: theme.palette.background.overlay || 'rgba(0, 0, 0, .6)',
      paper: theme.palette.background.paper || '#FFFFFF',
      secondary: theme.palette.background.secondary || '#FFFFFF',
      skeleton: theme.palette.background.skeleton || 'rgba(0, 0, 0, .08)',
    },
    divider: theme.palette.divider || 'rgba(0, 0, 0, 0.12)',
    error: {
      main: theme.palette.error.main || '#FF5252',
      text: theme.palette.error.text || '#FFFFFF',
    },
    primary: {
      dark: theme.palette.primary.dark || '#0288D1',
      hover: theme.palette.primary.hover || '#2E2E9E',
      light: theme.palette.primary.light || '#B3E5FC',
      main: theme.palette.primary.main || '#3636B9',
      text: theme.palette.primary.text || '#FFFFFF',
    },
    request: {
      background: theme.palette.request.background || '#D3D3F7',
      text: theme.palette.request.text || 'rgba(0, 0, 0, .87)',
    },
    response: {
      background: theme.palette.response.background || '#FFFFFF',
      text: theme.palette.response.text || 'rgba(0, 0, 0, .87)',
    },
    secondary: {
      main: theme.palette.secondary.main || '#FF4081',
      text: theme.palette.secondary.text || '#FFFFFF',
    },
    success: {
      main: theme.palette.success.main || '#2CBF87',
      text: theme.palette.success.text || '#FFFFFF',
    },
    text: {
      disabled: theme.palette.text.disabled || 'rgba(0, 0, 0, .38)',
      link: theme.palette.text.link || '#FF4081',
      primary: theme.palette.text.primary || 'rgba(0, 0, 0, .87)',
      secondary: theme.palette.text.secondary || 'rgba(0, 0, 0, .54)',
    },
    tooltip: {
      background: theme.palette.tooltip.background || '#616161E6',
      text: theme.palette.tooltip.text || '#FFFFFF',
    },
    warning:{
      main: theme.palette.warning.main || '#F3B63B',
      text: theme.palette.warning.text || '#FFFFFF',
    },
  },

  shadows: [
    theme.shadows[0] || 'none',
    theme.shadows[1] || '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
    theme.shadows[2] || '0px 1px 5px 0px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 3px 1px -2px rgba(0,0,0,0.12)',
    theme.shadows[3] || '0px 1px 8px 0px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 3px 3px -2px rgba(0,0,0,0.12)',
    theme.shadows[4] || '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    theme.shadows[5] || '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    theme.shadows[6] || '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    theme.shadows[7] || '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    theme.shadows[8] || '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    theme.shadows[9] || '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    theme.shadows[10] || '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    theme.shadows[11] || '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    theme.shadows[12] || '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    theme.shadows[13] || '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    theme.shadows[14] || '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    theme.shadows[15] || '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    theme.shadows[16] || '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    theme.shadows[17] || '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    theme.shadows[18] || '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    theme.shadows[19] || '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    theme.shadows[20] || '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    theme.shadows[21] || '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    theme.shadows[22] || '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    theme.shadows[23] || '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    theme.shadows[24] || '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],

  shape: {
    radius: {
      inner: theme.shape.radius.inner || 4,
      outer: theme.shape.radius.outer || 8,
    },
  },
};
