import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { Local } from '../tools/storage';
import { EventsContext } from './EventsContext';

export const GdprContext = React.createContext();
export function GdprProvider({ children }) {

  const [gdprPassed, setGdprPassed] = useState(Local.get(Local.names.gdpr));
  const event = useContext(EventsContext).onEvent('gdpr');
  const onAccept = useCallback(() => {
    setGdprPassed(true);
    event('acceptGdpr');
    Local.set(Local.names.gdpr, undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDecline = useCallback(() => {
    window.dydu.ui.toggle(1);
  }, []);

  return <GdprContext.Provider children={children} value={{
    gdprPassed,
    onAccept,
    onDecline
  }} />;
}


GdprProvider.propTypes = {
  children: PropTypes.object,
};
