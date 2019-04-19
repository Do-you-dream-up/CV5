import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Configuration from '../../tools/configuration';

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
    const styles = Configuration.get('bubble.styles');
    return <div className={classes} {...properties} ref={node => this.node = node} style={styles} />;
  }
}


Bubble.propTypes = {
  type: PropTypes.string,
};


export default Bubble;
