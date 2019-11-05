import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import Interaction from '../components/Interaction';
import { Local } from '../tools/storage';
import { ConfigurationContext } from './ConfigurationContext';


export const DialogContext = React.createContext();
export function DialogProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const [ interactions, setInteractions ] = useState([]);
  const [ secondaryActive, setSecondaryActive ] = useState(false);
  const [ secondaryContent, setSecondaryContent ] = useState(null);
  const { transient: secondaryTransient } = configuration.secondary;

  const add = useCallback(interaction => {
    setInteractions(previous => ([
      ...previous,
      ...(Array.isArray(interaction) ? interaction : [interaction]),
    ]));
  }, []);

  const addRequest = useCallback(text => {
    if (text) {
      if (secondaryTransient) {
        toggleSecondary(false)();
      }
      add(<Interaction text={text} type="request" />);
    }
  }, [add, secondaryTransient, toggleSecondary]);

  const addResponse = useCallback(({ text, sidebar }) => {
    if (text) {
      if (secondaryTransient) {
        toggleSecondary(false)();
      }
      add(<Interaction text={text} type="response" secondary={sidebar} thinking />);
    }
  }, [add, secondaryTransient, toggleSecondary]);

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ content, title, url }={}) => {
    if (content || title || url) {
      setSecondaryContent({body: content, title, url});
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
