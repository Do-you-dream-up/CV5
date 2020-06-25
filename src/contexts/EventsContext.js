import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import dotget from '../tools/dotget';
import { ConfigurationContext } from './ConfigurationContext';


export const EventsContext = React.createContext();
export function EventsProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const { active, features = {}, verbosity = 0 } = configuration.events;

  const onEvent = feature => (event, ...rest) => {
    if (active) {
      const actions = (features[feature] || {})[event];
      if (Array.isArray(actions)) {
        actions.forEach(action => {
          if (verbosity > 1) {
            console.info(`[Dydu][${feature}:${event}] '${action}' ${rest}`);
          }
          const f = dotget(window, action);
          if (typeof f === 'function') {
            f(...rest);
          }
          else if (verbosity > 0) {
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
