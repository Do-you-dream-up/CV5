import React from 'react';

import './index.scss';


class Teaser extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    return <div className="dydu-teaser" onClick={toggle}>Teaser</div>;
  }
}


export default Teaser;
