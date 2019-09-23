import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import useStyles from './styles';
import Contacts from '../Contacts';
import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';
import Onboarding from '../Onboarding';
import Secondary from '../Secondary';
import Tab from '../Tab';
import { DialogContext } from '../../contexts/DialogContext';
import { TabProvider } from '../../contexts/TabContext';
import { withConfiguration } from '../../tools/configuration';
import dydu from '../../tools/dydu';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import talk from '../../tools/talk';


/**
 * Root component of the chatbox. It implements the `window` API as well.
 */
function Chatbox({ configuration, open, toggle }) {

  const dialog = useContext(DialogContext);
  const classes = useStyles({configuration});
  const secondaryMode = configuration.secondary.mode;

  const ask = useCallback((text, options) => {
    text = text.trim();
    if (text) {
      options = Object.assign({hide: false}, options);
      if (!options.hide) {
        dialog.addRequest(text);
      }
      talk(text).then(dialog.addResponse);
    }
  }, [dialog]);

  useEffect(() => {
    if (!window.dydu) {
      window.dydu = {};
      window.dydu.chat = {
        ask: (text, options) => ask(text, options),
        empty: () => dialog.empty(),
        reply: text => dialog.addResponse({text: text}),
      };
      window.dydu.gdpr = {
        forget: () => dydu.gdpr({email: 'mmarques@dydu.ai', method: 'Delete'}).then(
          () => window.dydu.chat.reply('Forget success'),
          () => window.dydu.chat.reply('Forget error'),
        ),
        get: () => dydu.gdpr({email: 'mmarques@dydu.ai', method: 'Get'}).then(
          () => window.dydu.chat.reply('Get success'),
          () => window.dydu.chat.reply('Get error'),
        ),
      };
      window.dydu.localization = {
        get: () => dydu.getLocale(),
        set: locale => dydu.setLocale(locale).then(
          locale => window.dydu.chat.reply(`New locale set: '${locale}'.`),
          response => window.dydu.chat.reply(response),
        ),
      };
      window.dydu.lorem = {
        standard: () => window.dydu.chat.reply(LOREM_HTML),
        split: () => window.dydu.chat.reply(LOREM_HTML_SPLIT),
      };
      window.dydu.ui = {
        secondary: (open, { body, title }) => dialog.toggleSecondary(open, {body, title})(),
        toggle: open => toggle(open)(),
      };
    }
  }, [ask, dialog, toggle]);

  return (
    <TabProvider>
      <div className={classNames('dydu-chatbox', classes.root, {[classes.hidden]: !open})}>
        <Onboarding render>
          <div className={classNames('dydu-chatbox-body', classes.body)}>
            <Tab component={Dialog}
                 interactions={dialog.state.interactions}
                 onAdd={dialog.add}
                 render
                 value="dialog" />
            <Tab component={Contacts} value="contacts" />
            {secondaryMode === 'over' && <Secondary mode={secondaryMode} />}
          </div>
          <Footer onRequest={dialog.addRequest} onResponse={dialog.addResponse} />
        </Onboarding>
        <Header onClose={toggle(false)} style={{order: -1}} />
        {secondaryMode === 'side' && <Secondary mode={secondaryMode} />}
      </div>
    </TabProvider>
  );
}


Chatbox.propTypes = {
  configuration: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withConfiguration(Chatbox);
