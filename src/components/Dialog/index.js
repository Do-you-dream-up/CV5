import React from 'react';

import Interaction from '../Interaction';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const { interactions } = this.props;
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => (
          <Interaction key={index}
                       last={index === interactions.length - 1}
                       request={it.type === 'talk'}
                       text={it.values ? it.values.text : null} />
        ))}
      </div>
    );
  }
}


export default Dialog;
