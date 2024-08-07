import { useContext, useEffect } from 'react';

import { ModalContext } from '../../contexts/ModalContext';
import Paper from '../Paper';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useShadow } from '../../contexts/ShadowProvider';

/**
 * Dock for child content to be displayed within modal UI.
 *
 * The modal comes with an backdrop overlay that self-dismiss on click.
 */
export default function Modal() {
  const { configuration } = useConfiguration();
  const { Component, onReject, onResolve, options, thinking } = useContext(ModalContext);
  const classes = useStyles({ configuration });
  const { dismissable, variant } = options;
  const { shadowAnchor } = useShadow();

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
    shadowAnchor?.addEventListener('keydown', keyListener);
    return () => shadowAnchor?.removeEventListener('keydown', keyListener);
  }, [onDismiss, Component]);

  return Component ? (
    <div className={c('dydu-modal-overlay', classes.root)} role="presentation" onClick={onDismiss}>
      <Component
        className={c('dydu-modal', classes[variant])}
        component={Paper}
        onClick={onClick}
        onReject={onReject}
        onResolve={onResolve}
        thinking={thinking}
      />
    </div>
  ) : null;
}
