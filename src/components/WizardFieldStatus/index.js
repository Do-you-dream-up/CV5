import { mdiAlertCircleOutline, mdiCheck, mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


/**
 * A wizard field icon to display its current status.
 */
export default withStyles(styles)(class WizardFieldStatus extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    status: PropTypes.oneOf(['error', 'pending', 'success']),
  };

  render() {
    const { classes, status } = this.props;
    const { path, ...rest } = {
      error: {path: mdiAlertCircleOutline},
      pending: {path: mdiLoading, spin: 1},
      success: {path: mdiCheck},
    }[status];
    return <Icon {...rest} className={classes[status]} path={path} size={1} />;
  }
});
