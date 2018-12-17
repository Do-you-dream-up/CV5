import React from 'react';

import Dialog from '../Dialog';
import Footer from '../Footer';
import Header from '../Header';
import { HistoryProvider } from '../../contexts/History';

import './index.scss';


class Chatbox extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    return (
      <HistoryProvider>
        <div className="dydu-chatbox">
          <Header toggle={toggle} />
          <Dialog />
          <Footer />
        </div>
      </HistoryProvider>
    );
  }
}


export default Chatbox;
