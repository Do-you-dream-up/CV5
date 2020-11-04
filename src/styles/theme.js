import 'typeface-assistant';
import theme from '../../public/override/theme.json';
import breakpoints from './breakpoints';

export default {

  breakpoints,

  font: {
    monospace: theme.font.monospace,
    sansSerif: theme.font.sansSerif,
    serif: theme.font.serif,
  },

  palette: {
    action: {
      active: theme.palette.action.active,
      disabled: theme.palette.action.disabled,
      disabledBackground: theme.palette.action.disabledBackground,
      hover: theme.palette.action.hover,
      selected: theme.palette.action.selected
    },
    background: {
      bullet: theme.palette.background.bullet,
      default: theme.palette.background.default,
      dim: theme.palette.background.dim,
      highlight: theme.palette.background.highlight,
      menu: theme.palette.background.menu,
      overlay: theme.palette.background.overlay,
      paper: theme.palette.background.paper,
      secondary: theme.palette.background.secondary,
      skeleton: theme.palette.background.skeleton,
    },
    divider: theme.palette.divider,
    error: {
      main: theme.palette.error.main,
      text: theme.palette.error.text,
    },
    primary: {
      dark: theme.palette.primary.dark,
      light: theme.palette.primary.light,
      main: theme.palette.primary.main,
      text: theme.palette.primary.text
    },
    request: {
      background: theme.palette.request.background,
      text: theme.palette.request.text
    },
    response: {
      background: theme.palette.response.background,
      text: theme.palette.response.text
    },
    secondary: {
      main: theme.palette.secondary.main,
      text: theme.palette.secondary.text
    },
    success: {
      main: theme.palette.success.main,
      text: theme.palette.success.text
    },
    text: {
      disabled: theme.palette.text.disabled,
      link: theme.palette.text.link,
      primary: theme.palette.text.primary,
      secondary: theme.palette.text.secondary
    },
    tooltip: {
      background: theme.palette.tooltip.background,
      text: theme.palette.tooltip.text
    },
    warning:{
      main: theme.palette.warning.main,
      text: theme.palette.warning.text
    },
  },

  shadows: [
    theme.shadows[0],
    theme.shadows[1],
    theme.shadows[2],
    theme.shadows[3],
    theme.shadows[4],
    theme.shadows[5],
    theme.shadows[6],
    theme.shadows[7],
    theme.shadows[8],
    theme.shadows[9],
    theme.shadows[10],
    theme.shadows[11],
    theme.shadows[12],
    theme.shadows[13],
    theme.shadows[14],
    theme.shadows[15],
    theme.shadows[16],
    theme.shadows[17],
    theme.shadows[18],
    theme.shadows[19],
    theme.shadows[20],
    theme.shadows[21],
    theme.shadows[22],
    theme.shadows[23],
    theme.shadows[24],
    theme.shadows[25],
  ],

  shape: {
    radius: {
      inner: theme.shape.radius.inner,
      outer: theme.shape.radius.outer,
    },
  },
};
