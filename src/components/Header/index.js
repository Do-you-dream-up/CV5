import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';

import './index.scss';


class Header extends React.PureComponent {
  render() {
    const { toggle } = this.props;
    return (
      <div className="dydu-header">
        <div className="dydu-header-title">Header</div>
        <div className="dydu-header-actions">
          <Button onClick={toggle()} variant="icon">
            <img alt="Close" src="icons/close.png" title="Close" />
          </Button>
        </div>
      </div>
    );
  }
}


Header.propTypes = {
  toggle: PropTypes.func.isRequired,
};


export default Header;
