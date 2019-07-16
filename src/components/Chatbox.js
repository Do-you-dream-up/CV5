import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Dialog from './Dialog';
import Footer from './Footer';
import Header from './Header';
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
      dydu.talk(text).then(({ text }) => {
        if (text) {
          this.context.addResponse(text);
        }
      });
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
        <Header toggle={toggle} />
        <Dialog interactions={interactions} onAdd={add} />
        <Footer onRequest={addRequest} onResponse={addResponse} />
      </div>
    );
  }
}


export default withStyles(styles)(Chatbox);
