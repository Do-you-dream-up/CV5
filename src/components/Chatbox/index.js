import React from 'react';

import Footer from '../Footer';
import Header from '../Header';
import History from '../History';

import './index.scss';


class Chatbox extends React.Component {
  render() {
    return (
      <div className="dydu-chatbox">
        <Header />
        <History />
        <Footer />
      </div>
    );
  }
}


export default Chatbox;
