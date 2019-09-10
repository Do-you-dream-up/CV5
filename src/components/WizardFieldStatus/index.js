import classNames from 'classnames';
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
    error: PropTypes.string,
    status: PropTypes.oneOf(['error', 'pending', 'success']),
  };

  render() {
    const { classes, error, status } = this.props;
    const { path, title, ...rest } = {
      error: {path: mdiAlertCircleOutline, title: 'Error'},
      pending: {path: mdiLoading, spin: 1, title: 'Pending'},
      success: {path: mdiCheck, title: 'Success'},
    }[status];
    return (
      <div className={classes.root}>
        <Icon {...rest}
              className={classNames(classes.base, classes[status])}
              path={path}
              size={1}
              title={title} />
        {error && <div className={classes.tooltip} children={error} />}
      </div>
    );
  }
});
