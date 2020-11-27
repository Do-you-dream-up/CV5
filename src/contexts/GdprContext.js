import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Cookie } from '../tools/storage';


export const GdprContext = React.createContext();
export function GdprProvider({ children }) {

  const [gdprPassed, setGdprPassed] = useState(Cookie.get(Cookie.names.gdpr));

  const onAccept = useCallback(() => {
    setGdprPassed(true);
    Cookie.set(Cookie.names.gdpr);
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
