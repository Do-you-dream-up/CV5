import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '../Avatar';
import Interaction from '../Interaction';
import Loader from '../Loader';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const { interactions, thinking } = this.props;
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => {
          const type = it.type === 'talk' ? 'request' : 'response';
          return <Interaction avatar={<Avatar type={type} />}
                              key={index}
                              scroll={index === interactions.length - 1}
                              text={it.values ? it.values.text : null}
                              type={type} />;
        })}
        {thinking && <Interaction avatar={<Avatar type="response" />} children={<Loader />} scroll />}
      </div>
    );
  }
}


Dialog.propTypes = {
  interactions: PropTypes.array.isRequired,
  thinking: PropTypes.bool,
};


export default Dialog;
