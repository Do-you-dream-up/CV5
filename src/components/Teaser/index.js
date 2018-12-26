import PropTypes from 'prop-types';
import React from 'react';

import Configuration from '../../tools/configuration';

import './index.scss';


class Teaser extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    const style = (({height, width}) => ({height, width}))(Configuration.get('teaser', {}));
    return <div className="dydu-teaser" onClick={toggle()} style={style}>Teaser</div>;
  }
}


Teaser.propTypes = {
  toggle: PropTypes.func.isRequired,
};


export default Teaser;
