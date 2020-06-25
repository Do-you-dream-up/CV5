import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import dotget from '../tools/dotget';
import { ConfigurationContext } from './ConfigurationContext';


export const EventsContext = React.createContext();
export function EventsProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const { active, log } = configuration.events;

  const onEvent = feature => (event, ...rest) => {
    if (active) {
      const actions = (configuration.events[feature] || {})[event];
      if (Array.isArray(actions)) {
        actions.forEach(action => {
          if (log) {
            console.info(`[Dydu][${feature}:${event}] '${action}' ${rest}`);
          }
          const f = dotget(window, action);
          if (typeof f === 'function') {
            f(...rest);
          }
          else if (log) {
            console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
          }
        });
      }
    }
  };

  return <EventsContext.Provider children={children} value={{onEvent}} />;
}


EventsProvider.propTypes = {
  children: PropTypes.node,
};
