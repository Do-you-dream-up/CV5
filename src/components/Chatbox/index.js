import PropTypes from 'prop-types';
import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';
import Interaction from '../Interaction';
import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {interactions: []};

  add = interaction => {
    this.setState(state => ({
      interactions: [...state.interactions, ...(Array.isArray(interaction) ? interaction : [interaction])],
    }));
  };

  addRequest = text => {
    this.add(this.makeInteraction(text, 'request'));
  };

  addResponse = text => {
    this.add(this.makeInteraction(text, 'response', true));
  };

  fetchHistory = () => (
    dydu.history().then(response => {
      if (response.values && Array.isArray(response.values.interactions)) {
        const interactions = response.values.interactions.reduce((accumulator, it) => (
          accumulator.push(
            this.makeInteraction(it.user, 'request'),
            this.makeInteraction(it.text, 'response'),
          ) && accumulator
        ), []);
        this.add(interactions);
      }
    })
  );

  makeInteraction = (text, type, thinking) => <Interaction text={text} thinking={thinking} type={type} />;

  componentDidMount() {
    this.fetchHistory();
  }

  render() {
    const { theme, toggle } = this.props;
    const { interactions } = this.state;
    const styles = {
      backgroundColor: theme.palette.background.default,
      ...Configuration.getStyles('chatbox', theme),
    };
    return (
      <div className="dydu-chatbox" style={styles}>
        <Header toggle={toggle} />
        <Dialog interactions={interactions} />
        <Footer onRequest={this.addRequest} onResponse={this.addResponse} />
      </div>
    );
  }
}


Chatbox.propTypes = {
  theme: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withTheme(Chatbox);
