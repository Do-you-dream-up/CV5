import PropTypes from 'prop-types';
import React, { useState } from 'react';


const OPTIONS = {dismissable: true, variant: 'center'};


export const ModalContext = React.createContext();
export function ModalProvider({ children }) {

  const [ Component, setComponent ] = useState(null);
  const [ onReject, setOnReject ] = useState(null);
  const [ onResolve, setOnResolve ] = useState(null);
  const [ options, setOptions ] = useState(OPTIONS);
  const [ thinking, setThinking ] = useState(false);

  /**
   * Initialize values for a modal element. Values are further utilized by the
   * <Modal /> component.
   *
   * If an action is provided, resolve the modal only after the promised
   * returned by ACTION is fulfilled.
   *
   * @param {function} Component - The component to wrap with.
   * @param {action} [action] - Function returning a Promise object.
   * @param {Object} [options] - Extra options to pass to the modal component.
   * @returns {Promise}
   */
  const modal = (Component, action, options) => new Promise((resolve, reject) => {
    setComponent(() => Component);
    setOnReject(() => onCleanup(reject));
    setOnResolve(() => data => {
      if (typeof action === 'function') {
        setThinking(true);
        setTimeout(() => action(data).then(
          response => onCleanup(resolve)(response),
          response => onCleanup(reject)(response),
        ), 1000);
      }
      else {
        onCleanup(resolve)();
      }
    });
    setOptions(previous => ({...previous, ...options}));
  });

  const onCleanup = callback => data => {
    setComponent(null);
    setOnReject(null);
    setOnResolve(null);
    setOptions(OPTIONS);
    setThinking(false);
    if (typeof callback === 'function') {
      callback(data);
    }
  };

  return <ModalContext.Provider children={children} value={{
    Component,
    modal,
    onReject,
    onResolve,
    options,
    thinking,
  }} />;
}


ModalProvider.propTypes = {
  children: PropTypes.node,
};
