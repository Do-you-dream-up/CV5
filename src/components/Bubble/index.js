import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';


class Bubble extends React.PureComponent {

  scroll = () => {
    this.node.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  componentDidMount() {
    this.scroll();
  }

  render() {
    const { type, ...properties } = this.props;
    const classes = classNames('dydu-bubble', `dydu-bubble-${type}`);
    return <div className={classes} {...properties} ref={node => this.node = node} />;
  }
}


Bubble.propTypes = {
  type: PropTypes.string,
};


export default Bubble;
