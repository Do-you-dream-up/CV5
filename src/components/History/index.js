import React from 'react';

import Bubble from '../Bubble';

import './index.scss';


class History extends React.Component {
  render() {
    const bubbles = [];
    return (
      <div className="dydu-history">
        {bubbles.map((it, index) => <Bubble children={it.text} key={index} type={it.type} />)}
      </div>
    );
  }
}


export default History;
