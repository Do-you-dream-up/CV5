import React from 'react';

import Interaction from '../Interaction';

import './index.scss';


class History extends React.PureComponent {
  render() {
    const interactions = [];
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => <Interaction key={index} text={it.text} type={it.type} />)}
      </div>
    );
  }
}


export default History;
