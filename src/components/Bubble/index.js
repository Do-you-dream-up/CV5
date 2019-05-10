import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Scroll from '../Scroll';
import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';

import './index.scss';


class Bubble extends React.PureComponent {

  render() {
    const { html, theme, type } = this.props;
    const classes = classNames('dydu-bubble', `dydu-bubble-${type}`);
    const styles = {
      backgroundColor: theme.palette[type].background,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette[type].text,
      ...Configuration.getStyles('bubble', theme),
    };
    return <Scroll className={classes} dangerouslySetInnerHTML={{__html: html}} style={styles} />;
  }
}


Bubble.propTypes = {
  html: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};


export default withTheme(Bubble);
