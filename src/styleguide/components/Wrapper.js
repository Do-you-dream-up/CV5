import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider, createUseStyles } from 'react-jss';
import { ConfigurationProvider } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsProvider } from '../../contexts/EventsContext';
import { ModalProvider } from '../../contexts/ModalContext';
import { TabProvider } from '../../contexts/TabContext';
import theme from '../../styles/theme';
import { configuration } from '../../tools/configuration';
import data from '../../tools/configuration.json';
import '../../tools/internationalization';


const useStyles = createUseStyles({
  root: {
    '& > *': {
      margin: 8,
    },
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: -8,
  },
});


const json = configuration.sanitize(data);


export default function Wrapper({ children }) {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <ConfigurationProvider configuration={json}>
        <EventsProvider>
          <DialogProvider>
            <ModalProvider>
              <TabProvider>
                <div children={children} className={classes.root} />
              </TabProvider>
            </ModalProvider>
          </DialogProvider>
        </EventsProvider>
      </ConfigurationProvider>
    </ThemeProvider>
  );
}


Wrapper.propTypes = {
  children: PropTypes.element,
};
