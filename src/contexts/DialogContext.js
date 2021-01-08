import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useTheme } from 'react-jss';
import Interaction from '../components/Interaction';
import parseActions from '../tools/actions';
import dotget from '../tools/dotget';
import useViewport from '../tools/hooks/viewport';
import parseSteps from '../tools/steps';
import { Local } from '../tools/storage';
import { knownTemplates } from '../tools/template';
import { ConfigurationContext } from './ConfigurationContext';
import { EventsContext } from './EventsContext';

const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;

export const DialogContext = React.createContext();
export function DialogProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('chatbox');
  const [ disabled, setDisabled ] = useState(false);
  const [ interactions, setInteractions ] = useState([]);
  const [ locked, setLocked ] = useState(false);
  const [ placeholder, setPlaceholder ] = useState(null);
  const [ prompt, setPrompt ] = useState('');
  const [ secondaryActive, setSecondaryActive ] = useState(false);
  const [ secondaryContent, setSecondaryContent ] = useState(null);
  const [ text, setText ] = useState('');
  const [ typeResponse, setTypeResponse ] = useState(null);
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
      setLocked(false);
    }
    // eslint-disable-next-line no-use-before-define
  }, [add, isMobile, secondaryTransient, toggleSecondary]);

  const addResponse = useCallback(response => {
    const { askFeedback, guiAction, templateData, templateName, text, typeResponse, urlRedirect } = response;
    const steps = parseSteps(response);
    setText(text);
    setTypeResponse(typeResponse);
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
          console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
        }
      });
    }

    if (typeResponse && typeResponse.match(RE_REWORD)) {
      event('rewordDisplay');
    }

    const getContent = (text, templateData, templateName) => {
      const list = [].concat(text ? steps.map(({ text }) => text) : [text]);
      if (templateData && knownTemplates.includes(templateName)) {
        list.push(JSON.parse(templateData));
      }
      return list;
    };

    add(
      <Interaction askFeedback={askFeedback}
                   carousel={steps.length > 1}
                   children={getContent(text, templateData, templateName)}
                   type="response"
                   steps={steps}
                   templatename={templateName}
                   thinking />
    );
    // eslint-disable-next-line no-use-before-define
  }, [add, event, isMobile, secondaryTransient, toggleSecondary]);

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ body, title, url } = {}) => {
    if (body || title || url) {
      setSecondaryContent({body, title, url});
    }
  }, []);

  const toggleSecondary = useCallback((open, { body, height, title, url, width } = {}) => () => {
    if (body !== undefined || title !== undefined || url !== undefined ) {
      setSecondaryContent({body, height, title, url, width});
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
      locked,
      placeholder,
      prompt,
      secondaryActive,
      secondaryContent,
      setDisabled,
      setLocked,
      setPlaceholder,
      setPrompt,
      setSecondary,
      setText,
      text,
      toggleSecondary,
      typeResponse,
    }} />
  );
}


DialogProvider.propTypes = {
  children: PropTypes.object,
};
