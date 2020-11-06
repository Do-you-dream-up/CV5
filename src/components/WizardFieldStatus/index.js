import { mdiAlertCircleOutline, mdiCheck, mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * A wizard field icon to display its current status.
 */
function WizardFieldStatus({ error, status }) {

  const classes = useStyles();

  const { path, title, ...rest } = {
    error: {path: mdiAlertCircleOutline, title: 'Error'},
    pending: {path: mdiLoading, spin: 1, title: 'Pending'},
    success: {path: mdiCheck, title: 'Success'},
  }[status || 'pending'];
  return (
    <div className={classes.root}>
      <Icon {...rest} className={c(classes.base, classes[status])} path={path} size={1} title={title} />
      {error && <div className={classes.tooltip} children={error} />}
    </div>
  );
}


WizardFieldStatus.propTypes = {
  error: PropTypes.string,
  status: PropTypes.oneOf(['error', 'pending', 'success']),
};


export default WizardFieldStatus;
