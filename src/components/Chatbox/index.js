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
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import talk from '../../tools/talk';


const SECONDARY_MODE = Configuration.get('secondary.mode');


/**
 * Root component of the chatbox. It implements the `window` API as well.
 */
class Chatbox extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
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
    window.dydu.ask = (text, options) => this.ask(text, options);
    window.dydu.empty = () => this.context.empty();
    window.dydu.localization = {
      get: () => dydu.getLocale(),
      set: locale => dydu.setLocale(locale).then(
        locale => this.context.addResponse({text: `New locale set: '${locale}'.`}),
        response => this.context.addResponse({text: response}),
      ),
    };
    window.dydu.lorem = {
      standard: () => this.context.addResponse({text: LOREM_HTML}),
      split: () => this.context.addResponse({text: LOREM_HTML_SPLIT}),
    };
    window.dydu.reply = text => this.context.addResponse({text: text});
    window.dydu.toggle = open => this.props.toggle(open)();
    window.dydu.toggleSecondary = (open, { body, title }) => (
      this.context.toggleSecondary(open, {body, title})()
    );
  }

  render() {
    const { add, addRequest, addResponse, state: dialogState } = this.context;
    const { classes, open, toggle } = this.props;
    const { interactions } = dialogState;
    return (
      <TabProvider>
        <div className={classNames('dydu-chatbox', classes.root, {[classes.hidden]: !open})}>
          <Onboarding render>
            <div className={classNames('dydu-chatbox-body', classes.body)}>
              <Tab component={Dialog} interactions={interactions} onAdd={add} render value="dialog" />
              <Tab component={Contacts} value="contacts" />
              {SECONDARY_MODE === 'over' && <Secondary mode={SECONDARY_MODE} />}
            </div>
            <Footer onRequest={addRequest} onResponse={addResponse} />
          </Onboarding>
          <Header onClose={toggle(false)} style={{order: -1}} />
          {SECONDARY_MODE === 'side' && <Secondary mode={SECONDARY_MODE} />}
        </div>
      </TabProvider>
    );
  }
}


export default withStyles(styles)(Chatbox);