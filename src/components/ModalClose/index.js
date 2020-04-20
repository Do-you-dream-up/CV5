import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import useStyles from './styles';


/**
 * Confirmation modal to close the chatbox.
 */
export default function ModalClose({ className, component, onReject, onResolve, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('close');
  const body = t('body', {defaultValue: ''});
  const no = t('no');
  const title = t('title', {defaultValue: ''});
  const yes = t('yes');

  return React.createElement(component, {className: c('dydu-close', className), ...rest}, (
    <>
      {title && <h3 children={title} className={classes.title} />}
      {body && <p children={body} className={classes.body} />}
      <div children={title} className={classes.actions}>
        {typeof onReject === 'function' && <Button children={no} onClick={onReject} />}
        <Button children={yes} onClick={onResolve} />
      </div>
    </>
  ));
}


ModalClose.defaultProps = {
  component: 'div',
};


ModalClose.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
};
