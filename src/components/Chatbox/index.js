import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';
import dydu from '../../tools/dydu';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {
    interactions: [],
    thinking: false,
  };

  add = interaction => {
    this.setState(state => ({
      interactions: [...state.interactions, ...(Array.isArray(interaction) ? interaction : [interaction])],
    }));
  };

  addRequest = it => {
    this.add(this.makeInteraction(it, 'talk'));
  };

  addResponse = it => {
    this.think();
    setTimeout(function() {
      this.add(this.makeInteraction(it, 'talkResponse'));
      this.think(false);
    }.bind(this), 1000)
  };

  fetchHistory = () => (
    dydu.history().then(response => {
      if (response.values && Array.isArray(response.values.interactions)) {
        const interactions = response.values.interactions.reduce((accumulator, it) => (
          accumulator.push(
            this.makeInteraction(it.user, 'talk'),
            this.makeInteraction(it.text, 'talkResponse')) && accumulator
        ), []);
        this.add(interactions);
      }
    })
  );

  makeInteraction = (it, type) => (it && it.type ? it : {type: type, values: {text: it}});

  think = think => {
    this.setState({thinking: think === undefined ? true : !!think});
  };

  componentDidMount() {
    this.fetchHistory();
  }

  render() {
    const { toggle } = this.props;
    const { thinking, interactions } = this.state;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <Dialog thinking={thinking} interactions={interactions} />
        <Footer onRequest={this.addRequest} onResponse={this.addResponse} />
      </div>
    );
  }
}


export default Chatbox;
