import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';

import './index.scss';


class Chatbox extends React.PureComponent {

  state = {
    interactions: [],
  };

  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <Dialog interactions={this.state.interactions} />
        <Footer />
      </div>
    );
  }
}


export default Chatbox;
