import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Dialog from './Dialog';
import Footer from './Footer';
import Header from './Header';
import Interaction from './Interaction';
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

  state = {interactions: []};

  add = interaction => {
    this.setState(state => ({
      interactions: [
        ...state.interactions,
        ...(Array.isArray(interaction) ? interaction : [interaction]),
      ],
    }));
  };

  addRequest = text => {
    this.add(this.makeInteraction(text, 'request'));
  };

  addResponse = text => {
    this.add(this.makeInteraction(text, 'response', true));
  };

  fetchHistory = () => (
    dydu.history().then(({ interactions }) => {
      if (Array.isArray(interactions)) {
        interactions = interactions.reduce((accumulator, it) => (
          accumulator.push(
            this.makeInteraction(it.user, 'request'),
            this.makeInteraction(it.text, 'response'),
          ) && accumulator
        ), []);
        this.add(interactions);
      }
    })
  );

  makeInteraction = (text, type, thinking) => (
    <Interaction text={text} thinking={thinking} type={type} />
  );

  componentDidMount() {
    this.fetchHistory();
  }

  render() {
    const { classes, toggle } = this.props;
    const { interactions } = this.state;
    return (
      <div className={classNames('dydu-chatbox', classes.root)}>
        <Header toggle={toggle} />
        <Dialog interactions={interactions} />
        <Footer onRequest={this.addRequest} onResponse={this.addResponse} />
      </div>
    );
  }
}


Chatbox.propTypes = {
  classes: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withStyles(styles)(Chatbox);
