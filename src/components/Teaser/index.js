import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';


class Teaser extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    return <div className="dydu-teaser" onClick={toggle()}>Teaser</div>;
  }
}


Teaser.propTypes = {
  toggle: PropTypes.func.isRequired,
};


export default Teaser;
