import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Configuration from '../../tools/configuration';


const TEASER_TITLE = Configuration.get('teaser.title', null);


/**
 * Minified version of the chatbox.
 */
class Teaser extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const { classes, open, toggle } = this.props;
    return <div children={TEASER_TITLE}
                className={classNames('dydu-teaser', classes.root, {[classes.hidden]: !open})}
                onClick={toggle()} />;
  }
}


export default withStyles(styles)(Teaser);
