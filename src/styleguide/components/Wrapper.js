import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider, createUseStyles } from 'react-jss';
import theme from '../../styles/theme';


const useStyles = createUseStyles({
  root: {
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    margin: -8,
    '& > *': {
      margin: 8,
    },
  },
});


export default function Wrapper({ children }) {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div children={children} className={classes.root} />
    </ThemeProvider>
  );
}


Wrapper.propTypes = {
  children: PropTypes.element,
};
