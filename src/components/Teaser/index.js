import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import { withConfiguration } from '../../tools/configuration';


/**
 * Minified version of the chatbox.
 */
export default withConfiguration(withStyles(styles)(class Teaser extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const { classes, configuration, open, toggle } = this.props;
    const { title } = configuration.teaser;
    return <div children={title}
                className={classNames('dydu-teaser', classes.root, {[classes.hidden]: !open})}
                onClick={toggle()} />;
  }
}));
