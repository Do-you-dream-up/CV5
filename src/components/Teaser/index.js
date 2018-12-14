import React from 'react';

import './index.scss';


class Teaser extends React.Component {
  render() {
    const { toggle } = this.props;
    return <div className="dydu-teaser" onClick={toggle}>Teaser</div>;
  }
}


export default Teaser;
