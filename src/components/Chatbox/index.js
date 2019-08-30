import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
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
export default withConfiguration(withStyles(styles)(class Chatbox extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  /**
   * Send text to the bot and display the response after.
   *
   * @param {string} text - Text to send.
   * @param {Object} [options] - Extra options, `hide` to hide the request.
   * @public
   */
  ask = (text, options) => {
    text = text.trim();
    if (text) {
      options = Object.assign({hide: false}, options);
      if (!options.hide) {
        this.context.addRequest(text);
      }
      talk(text).then(this.context.addResponse);
    }
  };

  componentDidMount() {
    window.dydu.chat = {
      ask: (text, options) => this.ask(text, options),
      empty: () => this.context.empty(),
      reply: text => this.context.addResponse({text: text}),
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
      secondary: (open, { body, title }) => this.context.toggleSecondary(open, {body, title})(),
      toggle: open => this.props.toggle(open)(),
    };
  }

  render() {
    const { add, addRequest, addResponse, state: dialogState } = this.context;
    const { classes, configuration, open, toggle } = this.props;
    const { secondary } = configuration;
    const { interactions } = dialogState;
    return (
      <TabProvider>
        <div className={classNames('dydu-chatbox', classes.root, {[classes.hidden]: !open})}>
          <Onboarding render>
            <div className={classNames('dydu-chatbox-body', classes.body)}>
              <Tab component={Dialog} interactions={interactions} onAdd={add} render value="dialog" />
              <Tab component={Contacts} value="contacts" />
              {secondary.mode === 'over' && <Secondary mode={secondary.mode} />}
            </div>
            <Footer onRequest={addRequest} onResponse={addResponse} />
          </Onboarding>
          <Header onClose={toggle(false)} style={{order: -1}} />
          {secondary.mode === 'side' && <Secondary mode={secondary.mode} />}
        </div>
      </TabProvider>
    );
  }
}));
