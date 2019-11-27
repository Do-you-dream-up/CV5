import PropTypes from 'prop-types';
import React, { useState } from 'react';


export const ModalContext = React.createContext();
export function ModalProvider({ children }) {

  const [ Component, setComponent ] = useState(null);
  const [ onReject, setOnReject ] = useState(null);
  const [ onResolve, setOnResolve ] = useState(null);

  const modal = (Component, action) => new Promise((resolve, reject) => {
    setComponent(() => Component);
    setOnReject(() => onCleanup(reject));
    setOnResolve(() => data => {
      if (typeof action === 'function') {
        setTimeout(() => action(data).then(
          response => onCleanup(resolve)(response),
          response => onCleanup(reject)(response),
        ), 1000);
      }
      else {
        onCleanup(resolve)();
      }
    });
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
    Component,
    modal,
    onReject,
    onResolve,
  }} />;
}


ModalProvider.propTypes = {
  children: PropTypes.node,
};
