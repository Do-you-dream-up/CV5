import React from 'react';

import './index.scss';


class Header extends React.Component {
  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-header">
        <div className="dydu-header-title">Header</div>
        <ul className="dydu-header-actions">
          <li onClick={toggle}><img alt="Close" src="icons/close.png" title="Close"/></li>
        </ul>
      </div>
    );
  }
}


export default Header;
