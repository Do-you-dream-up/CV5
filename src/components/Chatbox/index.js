import React from 'react';

import Footer from '../Footer';
import Header from '../Header';
import History from '../History';

import './index.scss';


class Chatbox extends React.Component {
  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <History />
        <Footer />
      </div>
    );
  }
}


export default Chatbox;
