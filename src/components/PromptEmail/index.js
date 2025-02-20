import { EventsContext } from '../../contexts/EventsContext';
import Form from '../Form';
import Interaction from '../Interaction';
import PropTypes from 'prop-types';
import Skeleton from '../Skeleton';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useContext } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useDialog } from '../../contexts/DialogContext';

/**
 * Form to prompt user for his email for gdpr requests or conversation export.
 */
export default function PromptEmail({ onResolve, scroll, thinking, type }) {
  const { setPrompt } = useDialog();
  const { ready, t } = useTranslation('translation');
  const event = useContext(EventsContext).onEvent('gdpr');
  const welcome = t('exportConv.welcome', { defaultValue: '' });
  const classes = useStyles();

  const onSubmit = ({ email, withForget, withGet }) => {
    setPrompt('');
    if (type === 'gdpr') {
      const method = [withForget && 'Delete', withGet && 'Get'].filter((it) => it);
      method.map((val) => {
        event(`${val.toLowerCase()}PersonalData`);
      });
      dydu.gdpr({ email, method }).then(
        () => window.dydu.chat.reply(t('gdpr.get.success')),
        () => window.dydu.chat.reply(t('gdpr.get.error')),
      );
    } else if (type === 'exportConv') {
      dydu.exportConversation(email, { botLabel: 'Chatbot', userLabel: 'Moi' }).then(
        () => window.dydu.chat.reply(t('exportConv.get.success')),
        () => window.dydu.chat.reply(t('exportConv.get.error')),
      );
    }
  };

  const onDismiss = () => {
    setPrompt('');
  };

  return (
    !!ready && (
      <Interaction
        className={c('dydu-interaction-email', classes.email)}
        scroll={scroll}
        thinking={thinking}
        type="response"
      >
        <>
          {type === 'exportConv' && <div>{welcome}</div>}
          <Form
            className="dydu-email-form"
            data={{ email: '', withForget: false, withGet: true }}
            onResolve={onResolve || onSubmit}
            onDismiss={onDismiss}
          >
            {({ data, onChange }) => (
              <>
                <label className={c('dydu-email-form-field', classes.field)}>
                  <input
                    className={classes.input}
                    name="email"
                    onChange={onChange}
                    placeholder={ready ? t('promptEmail.placeholder') : null}
                    aria-label={ready ? t('promptEmail.placeholder') : null}
                    required
                    type="email"
                    value={data.email || ''}
                    autoComplete="email"
                  />
                </label>
                {type === 'gdpr' && (
                  <fieldset className={c('dydu-gdpr-form-fieldset')}>
                    <legend className={classes.srOnly}>{t('footer.menu.gdpr')}</legend>
                    <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
                      <input checked={data.withGet || ''} name="withGet" onChange={onChange} type="checkbox" />
                      <Skeleton height="1em" hide={!ready} variant="paragraph" width="16em">
                        <div children={t('gdpr.form.get.description')} />
                      </Skeleton>
                    </label>
                    <label className={c('dydu-gdpr-form-field', classes.fieldCheckbox)}>
                      <input checked={data.withForget || ''} name="withForget" onChange={onChange} type="checkbox" />
                      <Skeleton height="1em" hide={!ready} variant="paragraph" width="16em">
                        <div children={t('gdpr.form.forget.description')} />
                      </Skeleton>
                    </label>
                  </fieldset>
                )}
              </>
            )}
          </Form>
        </>
      </Interaction>
    )
  );
}

PromptEmail.propTypes = {
  onResolve: PropTypes.func,
  scroll: PropTypes.bool,
  thinking: PropTypes.bool,
  type: PropTypes.string,
};
