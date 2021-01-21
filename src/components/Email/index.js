import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContext} from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Form from '../Form';
import Interaction from '../Interaction';
import useStyles from './styles';


export default function Email({ onResolve, scroll, thinking}) {

    const { ready, t } = useTranslation('translation');
    const { setPrompt } = useContext(DialogContext);
    const welcome = t('email.welcome', {defaultValue: ''});
    const classes = useStyles();

    const onSubmit = ({ email }) => {
        setPrompt('');
        dydu.exportConversation(email, { botLabel:'Chatbot', userLabel:'Moi' }).then(
          () => window.dydu.chat.reply(t('email.get.success')),
          () => window.dydu.chat.reply(t('email.get.error')),
        );
    };

    const onDismiss = () => {
        setPrompt('');
    };

    return !!ready && (
      <Interaction className={c('dydu-interaction-email', classes.email)} scroll={scroll} thinking={thinking} type="response">
        <>
          <div>{welcome}</div>
          <Form className="dydu-email-form"
                data={{email: ''}}
                onResolve={onResolve || onSubmit}
                onDismiss={onDismiss}>
            {({ data, onChange }) => (
              <>
                <label className={c('dydu-email-form-field', classes.field)}>
                  <input className={c('dydu-input', classes.input)}
                         name="email"
                         onChange={onChange}
                         placeholder={ready ? t('email.form.placeholder') : null}
                         required
                         type="email"
                         value={data.email || ''} />
                </label>
              </>
            )}
          </Form>
        </>
      </Interaction>
    );
}

Email.propTypes = {
    onResolve: PropTypes.func,
    scroll: PropTypes.bool,
    thinking: PropTypes.bool,
};
