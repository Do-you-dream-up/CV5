import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Contacts from './Contacts';
import Dialog from './Dialog';
import Footer from './Footer';
import Header from './Header';
import Onboarding from './Onboarding';
import Secondary from './Secondary';
import Tab from './Tab';
import { DialogContext } from '../contexts/DialogContext';
import { TabProvider } from '../contexts/TabContext';
import Configuration from '../tools/configuration';
import LOREM from '../tools/lorem';
import talk from '../tools/talk';


const styles = theme => ({
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  hidden: {
    '&&': {display: 'none'},
  },
  root: {
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    position: 'absolute',
    right: 0,
    width: 350,
    '&&': Configuration.getStyles('chatbox'),
    [theme.breakpoints.down('xs')]: {'&&': Configuration.getStyles('chatbox.mobile')},
  },
});


const SECONDARY_MODE = Configuration.get('secondary.mode');


class Chatbox extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

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
    window.dydu.lorem = () => this.context.addResponse({text: Object.values(LOREM).join('')});
    window.dydu.reply = text => this.context.addResponse({text: text});
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
          <Header toggle={toggle} style={{order: -1}} />
          {SECONDARY_MODE === 'side' && <Secondary mode={SECONDARY_MODE} />}
        </div>
      </TabProvider>
    );
  }
}


export default withStyles(styles)(Chatbox);
