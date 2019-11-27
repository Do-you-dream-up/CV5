import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalContext } from '../../contexts/ModalContext';
import Actions from '../Actions';
import useStyles from './styles';


/**
 * GDPR form. Basically prompt for an email.
 */
export default function ModalGdpr({ className, component, ...rest }) {

  const { onReject, onResolve } = useContext(ModalContext);
  const [ email, setEmail ] = useState('');
  const classes = useStyles();
  const { t } = useTranslation('gdpr');

  const onCancel = () => {
    onReject();
  };

  const onChange = event => {
    setEmail(event.target.value);
  };

  const onSubmit = event => {
    event.preventDefault();
    onResolve(email);
  };

  const actions = [
    {action: onCancel, text: t('form.cancel')},
    {text: t('form.submit'), type: 'submit'},
  ];

  return React.createElement(
    component,
    {className: c('dydu-modal-gdpr', classes.root, className), component: 'form', onSubmit, ...rest},
    (
      <>
        <label className="dydu-modal-gdpr-field">
          <div children={t('form.email.label')} />
          <input className={classes.input}
                 onChange={onChange}
                 placeholder={t('form.email.placeholder')}
                 type="email"
                 value={email} />
        </label>
        <Actions actions={actions} className="dydu-modal-gdpr-actions" />
      </>
    ),
  );
}



ModalGdpr.defaultProps = {
  component: 'div',
};


ModalGdpr.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
};
