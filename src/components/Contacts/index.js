import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


/**
 * Current dummy placeholder for a secondary tab.
 */
class Contacts extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <p>Contacts.</p>
      </div>
    );
  }
}


export default withStyles(styles)(Contacts);
