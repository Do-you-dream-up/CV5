import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';

import './index.scss';


class Avatar extends React.PureComponent {
  render() {
    const { theme, type } = this.props;
    const classes = classNames('dydu-avatar', `dydu-avatar-${type}`);
    const styles = {
      backgroundColor: theme.palette[type].background,
      color: theme.palette[type].text,
      ...Configuration.getStyles('avatar', theme),
    };
    return <div className={classes} style={styles} />;
  }
}


Avatar.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.string,
};


export default withTheme(Avatar);
