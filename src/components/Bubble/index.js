import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Scroll from '../Scroll';
import Configuration from '../../tools/configuration';


const styles = theme => ({
  base: {
    borderRadius: theme.shape.borderRadius,
    padding: '1em',
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
    '&&': Configuration.getStyles('bubble'),
  },
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: 'auto',
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: 'auto',
  },
});


class Bubble extends React.PureComponent {
  render() {
    const { classes, html, type } = this.props;
    return (
      <Scroll className={classNames('dydu-bubble', `dydu-bubble-${type}`, classes.base, classes[type])}
              dangerouslySetInnerHTML={{__html: html}} />
    );
  }
}


Bubble.propTypes = {
  classes: PropTypes.object.isRequired,
  html: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};


export default withStyles(styles)(Bubble);
