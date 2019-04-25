import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';

import './index.scss';


class Bubble extends React.PureComponent {

  scroll = () => {
    this.node.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  componentDidMount() {
    this.scroll();
  }

  render() {
    const { theme, type, ...rest } = this.props;
    const classes = classNames('dydu-bubble', `dydu-bubble-${type}`);
    const styles = {
      backgroundColor: theme.palette[type].background,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette[type].text,
      ...Configuration.getStyles('bubble', theme),
    };
    return <div {...rest} className={classes} ref={node => this.node = node} style={styles} />;
  }
}


Bubble.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.string,
};


export default withTheme(Bubble);
