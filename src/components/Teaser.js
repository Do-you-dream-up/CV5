import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Configuration from '../tools/configuration';


const styles = theme => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '1em',
    '&&': Configuration.getStyles('teaser'),
  },
});


class Teaser extends React.PureComponent {
  render() {
    const { classes, toggle } = this.props;
    return <div className={classNames('dydu-teaser', classes.root)} onClick={toggle()}>Teaser</div>;
  }
}


Teaser.propTypes = {
  classes: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};


export default withStyles(styles)(Teaser);
