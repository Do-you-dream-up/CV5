import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import sanitize from '../../tools/sanitize';
import Form from '../Form';
import useStyles from './styles';


/**
 * GDPR form. Basically prompt for an email.
 */
export default function Gdpr({ className, component, onReject, onResolve, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('gdpr');

  const onSubmit = ({ email, withForget, withGet }) => {
    onResolve({email, method: [withForget && 'Forget', withGet && 'Get'].filter(it => it)});
  };

  const help = sanitize(t('form.help'));
  const title = t('form.title');

  return React.createElement(component, {className: c('dydu-gdpr', className), title, ...rest}, (
    <>
      {help && (
        <div className={c('dydu-gdpr-help', classes.help)} dangerouslySetInnerHTML={{__html: help}} />
      )}
      <Form className="dydu-gdpr-form"
            data={{email: '', withForget: false, withGet: true}}
            onReject={onReject}
            onResolve={onSubmit}>
        {({ data, onChange }) => (
          <>
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
          </>
        )}
      </Form>
    </>
  ));
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
