import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useTheme } from 'react-jss';
import Interaction from '../components/Interaction';
import useViewport from '../tools/hooks/viewport';
import { Local } from '../tools/storage';
import { ConfigurationContext } from './ConfigurationContext';


export const DialogContext = React.createContext();
export function DialogProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const [ interactions, setInteractions ] = useState([]);
  const [ secondaryActive, setSecondaryActive ] = useState(false);
  const [ secondaryContent, setSecondaryContent ] = useState(null);
  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { active: showFeedback } = configuration.feedback;
  const { transient: secondaryTransient } = configuration.secondary;

  const add = useCallback(interaction => {
    setInteractions(previous => ([
      ...previous,
      ...(Array.isArray(interaction) ? interaction : [interaction]),
    ]));
  }, []);

  const addRequest = useCallback(text => {
    if (text) {
      if (secondaryTransient || isMobile) {
        toggleSecondary(false)();
      }
      add(<Interaction text={text} type="request" />);
    }
    // eslint-disable-next-line no-use-before-define
  }, [add, isMobile, secondaryTransient, toggleSecondary]);

  const addResponse = useCallback(({ askFeedback, sidebar, text }) => {
    if (secondaryTransient || isMobile) {
      toggleSecondary(false)();
    }
    add(
      <Interaction hasFeedback={!!(showFeedback && askFeedback)}
                   text={text}
                   type="response"
                   secondary={sidebar}
                   thinking />
    );
    // eslint-disable-next-line no-use-before-define
  }, [add, isMobile, secondaryTransient, showFeedback, toggleSecondary]);

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ body, title, url } = {}) => {
    if (body || title || url) {
      setSecondaryContent({body, title, url});
    }
  }, []);

  const toggleSecondary = useCallback(open => () => {
    setSecondaryActive(previous => {
      const should = open === undefined ? !previous : open;
      if (Local.get(Local.names.secondary) !== should) {
        Local.set(Local.names.secondary, should);
      }
      return should;
    });
  }, []);

  return <DialogContext.Provider children={children} value={{
    add,
    addRequest,
    addResponse,
    empty,
    interactions,
    secondaryActive,
    secondaryContent,
    setSecondary,
    toggleSecondary,
  }} />;
}


DialogProvider.propTypes = {
  children: PropTypes.object,
};
