import c from 'classnames';
import React, { useContext, useEffect } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { ModalContext } from '../../contexts/ModalContext';
import Paper from '../Paper';
import useStyles from './styles';

/**
 * Dock for child content to be displayed within modal UI.
 *
 * The modal comes with an backdrop overlay that self-dismiss on click.
 */
export default function Modal() {
  const { configuration } = useContext(ConfigurationContext);
  const { Component, onReject, onResolve, options, thinking } =
    useContext(ModalContext);
  const classes = useStyles({ configuration });
  const { dismissable, variant } = options;

  const onClick = (event) => {
    event.stopPropagation();
  };

  const onDismiss = dismissable ? onReject : null;

  useEffect(() => {
    const keyListener = (e) => {
      if (!!Component && e.keyCode === 27) {
        onDismiss();
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => document.removeEventListener('keydown', keyListener);
  }, [onDismiss, Component]);

  return (
    !!Component && (
      <div
        className={c('dydu-modal-overlay', classes.root)}
        onClick={onDismiss}
      >
        <Component
          className={c('dydu-modal', classes[variant])}
          component={Paper}
          onClick={onClick}
          onReject={onReject}
          onResolve={onResolve}
          thinking={thinking}
        />
      </div>
    )
  );
}
