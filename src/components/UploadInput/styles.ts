/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => ({
  upload: () => ({
    '&:not(:disabled)': {
      backgroundColor: theme?.palette?.primary?.main ?? 'rgb(65, 71, 155)',
    },
    '&:disabled': {
      cursor: 'auto',
    },
  }),
  sendfile: () => ({
    '&:not(:disabled)': {
      backgroundColor: theme?.palette?.primary?.main ?? 'rgb(65, 71, 155)',
    },
    '&:disabled': {
      cursor: 'wait',
    },
  }),
  color: () => ({
    color: theme?.palette?.primary?.main ?? 'rgb(65, 71, 155)',
  }),
  cancel: () => ({
    background: 'transparent',
    color: theme?.palette?.primary?.main + ' !important' ?? 'rgb(65, 71, 155)',
    borderColor: theme?.palette?.primary?.main + ' !important' ?? 'rgb(65, 71, 155)',
  }),
  root: () => ({
    display: 'flex',
    width: '100%',
  }),
}));
