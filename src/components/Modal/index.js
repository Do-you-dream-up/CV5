import c from 'classnames';
import React, { useContext } from 'react';
import { ModalContext } from '../../contexts/ModalContext';
import Paper from '../Paper';
import useStyles from './styles';


/**
 *
 */
export default function Modal() {

  const { component, onReject } = useContext(ModalContext);
  const classes = useStyles();

  const onClick = event => {
    event.stopPropagation();
  };

  return !!component && (
    <div className={c('dydu-modal-overlay', classes.root)} onClick={onReject}>
      <Paper children={component}
             className={c('dydu-modal', classes.modal)}
             onClick={onClick}
             title="Some long title" />
    </div>
  );
}
