import React from 'react';

import Avatar from '../Avatar';
import Interaction from '../Interaction';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const { interactions } = this.props;
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => {
          const type = it.type === 'talk' ? 'request' : 'response';
          return <Interaction avatar={<Avatar type={type} />}
                              key={index}
                              last={index === interactions.length - 1}
                              text={it.values ? it.values.text : null}
                              type={type} />;
        })}
      </div>
    );
  }
}


export default Dialog;
