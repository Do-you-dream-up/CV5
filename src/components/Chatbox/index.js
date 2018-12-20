import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {
    interactions: [],
    thinking: false,
  };

  add = interaction => {
    this.setState(state => ({interactions: [...state.interactions, interaction]}));
  };

  addRequest = it => {
    this.add(it && it.type ? it : {type: 'talk', values: {text: it}});
  };

  addResponse = it => {
    this.think();
    setTimeout(function() {
      this.add(it && it.type ? it : {type: 'talkResponse', values: {text: it}})
      this.think(false);
    }.bind(this), 1000)
  };

  think = think => {
    this.setState({thinking: think === undefined ? true : !!think});
  };

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
