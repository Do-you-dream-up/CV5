import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';

import './index.scss';


class Chatbox extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-chatbox">
        <Header toggle={toggle} />
        <Dialog />
        <Footer />
      </div>
    );
  }
}


export default Chatbox;
