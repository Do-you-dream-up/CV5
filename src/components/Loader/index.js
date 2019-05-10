import PropTypes from 'prop-types';
import React from 'react';

import Scroll from '../Scroll';

import './index.scss';


class Loader extends React.PureComponent {
  render() {
    const { size=3 } = this.props;
    return (
      <Scroll className="dydu-loader">
        {[...Array(size)].map((it, index) => (
          <div className="dydu-loader-bullet" key={index} style={{animationDelay: `${index / 10}s`}} />
        ))}
      </Scroll>
    );
  }
}


Loader.propTypes = {
  size: PropTypes.number,
};


export default Loader;
