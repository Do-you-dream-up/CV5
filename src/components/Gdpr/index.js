import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContext} from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Form from '../Form';
import Interaction from '../Interaction';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * GDPR form. Basically prompt for an email.
 */
export default function Gdpr({ onResolve, scroll, thinking }) {

  const { setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { ready, t } = useTranslation('translation');

  const onSubmit = ({ email, withForget, withGet }) => {
    setPrompt('');
    const method = [withForget && 'Delete', withGet && 'Get'].filter(it => it);
    dydu.gdpr({email, method}).then(
      () => window.dydu.chat.reply(t('gdpr.get.success')),
      () => window.dydu.chat.reply(t('gdpr.get.error')),
    );
  };

  const onDismiss = () => {
    setPrompt('');
  };

  return !!ready && (
    <Interaction className="dydu-interaction-gdpr" scroll={scroll} thinking={thinking} type="response">
      <>
        <Form className="dydu-gdpr-form"
              data={{email: '', withForget: false, withGet: true}}
              onResolve={onResolve || onSubmit}
              onDismiss={onDismiss}>
          {({ data, onChange }) => (
            <>
              <label className={c('dydu-gdpr-form-field', classes.field)}>
                <input className={classes.input}
                       name="email"
                       onChange={onChange}
                       placeholder={ready ? t('gdpr.form.email.placeholder') : null}
                       required
                       type="email"
                       value={data.email} />
              </label>
              <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
                <input checked={data.withGet} name="withGet" onChange={onChange} type="checkbox" />
                <Skeleton height="1em" hide={!ready} variant="paragraph" width="16em">
                  <div children={t('gdpr.form.get.description')} />
                </Skeleton>
              </label>
              <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
                <input checked={data.withForget} name="withForget" onChange={onChange} type="checkbox" />
                <Skeleton height="1em" hide={!ready} variant="paragraph" width="16em">
                  <div children={t('gdpr.form.forget.description')} />
                </Skeleton>
              </label>
            </>
          )}
        </Form>
      </>
    </Interaction>
  );
}


Gdpr.propTypes = {
  onResolve: PropTypes.func,
  scroll: PropTypes.bool,
  thinking: PropTypes.bool,
};
