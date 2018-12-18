import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {
    interactions: [],
  };

  add = interaction => {
    this.setState(state => ({interactions: [...state.interactions, interaction]}));
  };

  addRequest = it => {
    this.add(it && it.type ? it : {type: 'talk', values: {text: it}});
  };

  addResponse = it => {
    this.add(it && it.type ? it : {type: 'talkResponse', values: {text: it}});
  };

  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <Dialog interactions={this.state.interactions} />
        <Footer onRequest={this.addRequest} onResponse={this.addResponse} />
      </div>
    );
  }
}


export default Chatbox;
