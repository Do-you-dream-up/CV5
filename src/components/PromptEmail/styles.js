import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  email: {
    '& > div': {
      '& > div': {
        '& > div': {
          '& > div': {
            '& > div': {
              '& > div': {
                marginBottom: '.5em',
              },
              flexDirection: 'column',
            },
          },
        },
      },
    },
  },
  field: {
    '&:not(:last-child)': {
      marginBottom: '1em',
    },
    display: 'block',
  },
  fieldCheckbox: {
    '& > input[type="checkbox"]': {
      margin: 0,
    },
    '& > input[type="checkbox"] + *': {
      marginLeft: '1em',
    },
    alignItems: 'center',
    display: 'flex',
    extend: 'field',
  },
  input: {
    '&:not(:first-child)': {
      marginTop: '.5em',
    },
    border: '1px solid #bdc3c7',
    borderRadius: theme.shape.radius.inner,
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: theme.font.monospace,
    margin: 0,
    padding: '.6em',
    width: '100%',
  },
  srOnly: {
    position: 'absolute',
    clip: 'rect(0, 0, 0, 0)',
  },
  fieldset: {
    border: 'none',
  },
}));
