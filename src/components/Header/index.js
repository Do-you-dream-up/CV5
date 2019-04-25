import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';
import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';

import './index.scss';


class Header extends React.PureComponent {
  render() {
    const { theme, toggle } = this.props;
    const styles = {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.text,
      ...Configuration.getStyles('header', theme),
    };
    return (
      <div className="dydu-header" style={styles}>
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
  theme: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withTheme(Header);
