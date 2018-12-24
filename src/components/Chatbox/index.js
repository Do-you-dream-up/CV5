import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '../Avatar';
import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';
import Interaction from '../Interaction';
import dydu from '../../tools/dydu';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {
    interactions: [],
  };

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

  makeInteraction = (text, type, thinking) => (
    <Interaction avatar={<Avatar type={type} />} text={text} thinking={thinking} type={type} />
  );

  componentDidMount() {
    this.fetchHistory();
  }

  render() {
    const { toggle } = this.props;
    const { interactions } = this.state;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <Dialog interactions={interactions} />
        <Footer onRequest={this.addRequest} onResponse={this.addResponse} />
      </div>
    );
  }
}


Chatbox.propTypes = {
  toggle: PropTypes.func.isRequired,
};


export default Chatbox;
