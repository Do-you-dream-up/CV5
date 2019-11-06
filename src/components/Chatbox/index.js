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
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import { TabProvider } from '../../contexts/TabContext';
import dydu from '../../tools/dydu';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import talk from '../../tools/talk';


/**
 * Root component of the chatbox. It implements the `window` API as well.
 */
const Chatbox = React.forwardRef(({ open, toggle, ...rest }, root) => {

  const { configuration } = useContext(ConfigurationContext);
  const {
    add,
    addRequest,
    addResponse,
    empty,
    interactions,
    secondaryActive,
    setSecondary,
    toggleSecondary,
  } = useContext(DialogContext);
  const classes = useStyles({configuration});
  const qualification = !!configuration.application.qualification;
  const secondaryMode = configuration.secondary.mode;

  const ask = useCallback((text, options) => {
    text = text.trim();
    if (text) {
      options = Object.assign({hide: false}, options);
      if (!options.hide) {
        addRequest(text);
      }
      talk(text, {qualification}).then(addResponse);
    }
  }, [addRequest, addResponse, qualification]);

  useEffect(() => {
    if (!window.dydu) {
      window.dydu = {};
      window.dydu.chat = {
        ask: (text, options) => ask(text, options),
        empty: () => empty(),
        reply: text => addResponse({text}),
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
        secondary: (open, { body, title }) => {
          setSecondary({body, title})();
          toggleSecondary(open)();
        },
        toggle: mode => toggle(mode)(),
      };
      window.reword = window.dydu.chat.ask;
    }
  }, [addResponse, ask, empty, setSecondary, toggle, toggleSecondary]);

  return (
    <TabProvider>
      <div className={classNames('dydu-chatbox', classes.root, {[classes.rootHidden]: !open})}
           ref={root}
           {...rest}>
        <Onboarding render>
          <div className={classNames(
            'dydu-chatbox-body',
            classes.body,
            {[classes.bodyHidden]: secondaryActive && secondaryMode === 'over'},
          )}>
            <Tab component={Dialog} interactions={interactions} onAdd={add} render value="dialog" />
            <Tab component={Contacts} value="contacts" />
          </div>
          {secondaryMode === 'over' && <Secondary />}
          <Footer onRequest={addRequest} onResponse={addResponse} />
        </Onboarding>
        <Header onClose={toggle(1)} style={{order: -1}} />
        {secondaryMode !== 'over' && <Secondary anchor={root} />}
      </div>
    </TabProvider>
  );
});


Chatbox.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default Chatbox;
