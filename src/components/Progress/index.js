import PropTypes from 'prop-types';
import c from 'classnames';
import useStyles from './styles';

/**
 * Display a progress status.
 */
export default function Progress({ className }) {
  const classes = useStyles();
  return (
    <div data-testid="progress" className={c('dydu-progress', classes.root, className)}>
      <div className={classes.back} />
      <div className={classes.segmentGrow} />
      <div className={classes.segmentShrink} />
    </div>
  );
}

Progress.propTypes = {
  className: PropTypes.string,
};
