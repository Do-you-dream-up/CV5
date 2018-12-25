import React from 'react';

import Chatbox from '../Chatbox';
import Teaser from '../Teaser';
import Cookie from '../../tools/cookie';

import './index.scss';


class Application extends React.PureComponent {

  state = {open: false};

  toggle = open => () => {
    open = open === undefined ? !this.state.open : !!open;
    this.setState(
      ({open: open}),
      () => Cookie.set(Cookie.cookies.open, open, Cookie.duration.long),
    );
  };

  componentDidMount() {
    const open = Cookie.get(Cookie.cookies.open);
    this.toggle(open)();
  }

  render() {
    return React.createElement(this.state.open ? Chatbox : Teaser, {toggle: this.toggle});
  }
}


export default Application;
