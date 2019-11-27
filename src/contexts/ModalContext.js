import PropTypes from 'prop-types';
import React, { useState } from 'react';


export const ModalContext = React.createContext();
export function ModalProvider({ children }) {

  const [ component, setComponent ] = useState(null);
  const [ onReject, setOnReject ] = useState(null);
  const [ onResolve, setOnResolve ] = useState(null);

  const modal = component => new Promise((resolve, reject) => {
    setComponent(component);
    setOnReject(() => onCleanup(reject));
    setOnResolve(() => onCleanup(resolve));
  });

  const onCleanup = callback => data => {
    setComponent(null);
    setOnReject(null);
    setOnResolve(null);
    if (typeof callback === 'function') {
      callback(data);
    }
  };

  return <ModalContext.Provider children={children} value={{
    component,
    modal,
    onReject,
    onResolve,
  }} />;
}


ModalProvider.propTypes = {
  children: PropTypes.node,
};
