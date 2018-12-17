import React from 'react';

import Interaction from '../Interaction';
import { HistoryConsumer } from '../../contexts/History';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    return (
      <HistoryConsumer>
        {({state}) => (
          <div className="dydu-history">
            {state.interactions.map((it, index) => <Interaction key={index} text={it.text} type={it.type} />)}
          </div>
        )}
      </HistoryConsumer>
    );
  }
}


export default Dialog;
