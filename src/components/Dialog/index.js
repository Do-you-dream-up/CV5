import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const { interactions } = this.props;
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => ({...it, key: index}))}
      </div>
    );
  }
}


Dialog.propTypes = {
  interactions: PropTypes.array.isRequired,
};


export default Dialog;
