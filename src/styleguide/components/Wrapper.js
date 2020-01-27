import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider, createUseStyles } from 'react-jss';
import { ConfigurationProvider } from '../../contexts/ConfigurationContext';
import reset from '../../styles/reset';
import theme from '../../styles/theme';
import { configuration } from '../../tools/configuration';
import data from '../../tools/configuration.json';


const useStyles = createUseStyles({
  root: {
    ...reset(theme),
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    margin: -8,
    '& > *': {
      margin: 8,
    },
  },
});


const json = configuration.sanitize(data);


export default function Wrapper({ children }) {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <ConfigurationProvider configuration={json}>
        <div children={children} className={classes.root} />
      </ConfigurationProvider>
    </ThemeProvider>
  );
}


Wrapper.propTypes = {
  children: PropTypes.element,
};
