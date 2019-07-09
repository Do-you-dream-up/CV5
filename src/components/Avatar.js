import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Configuration from '../tools/configuration';


const styles = theme => ({
  base: {
    borderRadius: '50%',
    height: '3em',
    width: '3em',
    '&&': Configuration.getStyles('avatar'),
  },
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: '.5em',
    order: 2,
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: '.5em',
  },
});


class Avatar extends React.PureComponent {
  render() {
    const { classes, type } = this.props;
    return (
      <div className={classNames('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type])} />
    );
  }
}


Avatar.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};


export default withStyles(styles)(Avatar);
