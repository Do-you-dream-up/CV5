import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import sanitize from '../../tools/sanitize';
import Actions from '../Actions';
import useStyles from './styles';


/**
 * GDPR form. Basically prompt for an email.
 */
export default function Gdpr({ className, component, onReject, onResolve, ...rest }) {

  const [ data, setData ] = useState({email: '', withForget: false, withGet: true});
  const classes = useStyles();
  const { t } = useTranslation('gdpr');

  const onCancel = () => {
    onReject();
  };

  const onChange = event => {
    const { checked, name, type, value } = event.target;
    setData(previous => ({...previous, [name]: type === 'checkbox' ? checked : value}));
  };

  const onSubmit = event => {
    event.preventDefault();
    const { email, withForget, withGet } = data;
    onResolve({email, method: [withForget && 'Forget', withGet && 'Get'].filter(it => it)});
  };

  const actions = [
    {action: onCancel, text: t('form.cancel')},
    {disabled: !data.withForget && !data.withGet, text: t('form.submit'), type: 'submit'},
  ];

  const help = sanitize(t('form.help'));

  return React.createElement(
    component,
    {className: c('dydu-gdpr', className), title: t('form.title'), ...rest},
    (
      <>
        {help && (
          <div className={c('dydu-gdpr-help', classes.help)}
               dangerouslySetInnerHTML={{__html: help}} />
        )}
        <form className="dydu-gdpr-form" onSubmit={onSubmit}>
          <label className={c('dydu-gdpr-form-field', classes.field)}>
            <div children={t('form.email.label')} />
            <input className={classes.input}
                   name="email"
                   onChange={onChange}
                   placeholder={t('form.email.placeholder')}
                   required
                   type="email"
                   value={data.email} />
          </label>
          <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
            <input checked={data.withGet} name="withGet" onChange={onChange} type="checkbox" />
            <div children={t('form.get.description')} />
          </label>
          <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
            <input checked={data.withForget} name="withForget" onChange={onChange} type="checkbox" />
            <div children={t('form.forget.description')} />
          </label>
          <Actions actions={actions} className="dydu-gdpr-form-actions" />
        </form>
      </>
    ),
  );
}


Gdpr.defaultProps = {
  component: 'div',
};


Gdpr.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  onReject: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
};
