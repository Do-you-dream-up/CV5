import React from 'react';

import Chatbox from '../Chatbox';
import Teaser from '../Teaser';

import './index.scss';


class Application extends React.Component {

  state = {open: true};

  toggle = () => {
    this.setState(state => ({open: !state.open}));
  };

  render() {
    return React.createElement(this.state.open ? Chatbox : Teaser, {toggle: this.toggle});
  }
}


export default Application;
