import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';


class Bubble extends React.PureComponent {
  render() {
    const { type, ...properties } = this.props;
    const classes = classNames('dydu-bubble', `dydu-bubble-${type}`);
    return <div className={classes} {...properties}></div>;
  }
}


Bubble.propTypes = {
  type: PropTypes.string,
};


export default Bubble;
