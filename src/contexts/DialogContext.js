import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useTheme } from 'react-jss';
import Interaction from '../components/Interaction';
import parseActions from '../tools/actions';
import dotget from '../tools/dotget';
import useViewport from '../tools/hooks/viewport';
import { Local } from '../tools/storage';
import { ConfigurationContext } from './ConfigurationContext';


export const DialogContext = React.createContext();
export function DialogProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const [ disabled, setDisabled ] = useState(false);
  const [ interactions, setInteractions ] = useState([]);
  const [ placeholder, setPlaceholder ] = useState(null);
  const [ prompt, setPrompt ] = useState('');
  const [ secondaryActive, setSecondaryActive ] = useState(false);
  const [ secondaryContent, setSecondaryContent ] = useState(null);
  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
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
      add(<Interaction children={text} type="request" />);
      setPlaceholder(null);
    }
    // eslint-disable-next-line no-use-before-define
  }, [add, isMobile, secondaryTransient, toggleSecondary]);

  const addResponse = useCallback(({ askFeedback, guiAction, sidebar, text, urlRedirect }) => {
    if (secondaryTransient || isMobile) {
      toggleSecondary(false)();
    }
    if (urlRedirect) {
      window.open(urlRedirect, '_blank');
    }
    if (guiAction) {
      parseActions(guiAction).forEach(({ action, parameters }) => {
        const f = dotget(window, action);
        if (typeof f === 'function') {
          f(...parameters);
        }
        else {
          console.warn(`Action '${action}' was not found in 'window' object.`);
        }
      });
    }
    add(
      <Interaction askFeedback={askFeedback}
                   children={text}
                   type="response"
                   secondary={sidebar}
                   thinking />
    );
    // eslint-disable-next-line no-use-before-define
  }, [add, isMobile, secondaryTransient, toggleSecondary]);

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ body, title, url } = {}) => {
    if (body || title || url) {
      setSecondaryContent({body, title, url});
    }
  }, []);

  const toggleSecondary = useCallback((open, { body, title, url } = {}) => () => {
    if (body !== undefined || title !== undefined || url !== undefined ) {
      setSecondaryContent({body, title, url});
    }
    setSecondaryActive(previous => {
      const should = open === undefined ? !previous : open;
      if (Local.get(Local.names.secondary) !== should) {
        Local.set(Local.names.secondary, should);
      }
      return should;
    });
  }, []);

  return (
    <DialogContext.Provider children={children} value={{
      add,
      addRequest,
      addResponse,
      disabled,
      empty,
      interactions,
      placeholder,
      prompt,
      secondaryActive,
      secondaryContent,
      setDisabled,
      setPlaceholder,
      setPrompt,
      setSecondary,
      toggleSecondary,
    }} />
  );
}


DialogProvider.propTypes = {
  children: PropTypes.object,
};
