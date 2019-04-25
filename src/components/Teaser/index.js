import PropTypes from 'prop-types';
import React from 'react';

import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';

import './index.scss';


class Teaser extends React.PureComponent {
  render() {
    const { theme, toggle } = this.props;
    const styles = {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.primary.text,
      ...Configuration.getStyles('teaser', theme),
    };
    return <div className="dydu-teaser" onClick={toggle()} style={styles}>Teaser</div>;
  }
}


Teaser.propTypes = {
  theme: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withTheme(Teaser);
