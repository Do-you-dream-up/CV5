import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Dialog from './Dialog';
import Footer from './Footer';
import Header from './Header';
import Onboarding from './Onboarding';
import { DialogContext } from '../contexts/DialogContext';
import Configuration from '../tools/configuration';
import dydu from '../tools/dydu';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    '&&': Configuration.getStyles('chatbox'),
  },
});


class Chatbox extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    classes: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  reword = (text, options) => {
    text = text.trim();
    if (text) {
      options = Object.assign({hide: false}, options);
      if (!options.hide) {
        this.context.addRequest(text);
      }
      dydu.talk(text).then(this.context.addResponse);
    }
  };

  componentDidMount() {
    window.dydu.reword = this.reword;
  }

  render() {
    const { add, addRequest, addResponse, state: dialogState } = this.context;
    const { classes, toggle } = this.props;
    const { interactions } = dialogState;
    return (
      <div className={classNames('dydu-chatbox', classes.root)}>
        <Onboarding render style={{order: 2}}>
          <Dialog interactions={interactions} onAdd={add} style={{order: 2}} />
          <Footer onRequest={addRequest} onResponse={addResponse} style={{order: 3}} />
        </Onboarding>
        <Header toggle={toggle} style={{order: 1}} />
      </div>
    );
  }
}


export default withStyles(styles)(Chatbox);
