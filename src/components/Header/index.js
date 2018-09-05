import React from 'react';

import Button from '../Button';

import './index.scss';


class Header extends React.Component {
  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-header">
        <div className="dydu-header-title">Header</div>
        <ul className="dydu-header-actions">
          <Button component="li" onClick={toggle} variant="icon">
            <img alt="Close" src="icons/close.png" title="Close"/>
          </Button>
        </ul>
      </div>
    );
  }
}


export default Header;
