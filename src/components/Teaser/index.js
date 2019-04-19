import PropTypes from 'prop-types';
import React from 'react';

import Configuration from '../../tools/configuration';

import './index.scss';


class Teaser extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    const styles = Configuration.get('teaser.styles');
    return <div className="dydu-teaser" onClick={toggle()} style={styles}>Teaser</div>;
  }
}


Teaser.propTypes = {
  toggle: PropTypes.func.isRequired,
};


export default Teaser;
