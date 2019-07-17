import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';


const styles = theme => ({

  base: {
    alignItems: 'center',
    background: 0,
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    outline: 'none',
    padding: 0,
    '& > *:not(:first-child)': {
      marginLeft: '.5em',
    },
  },

  default: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    color: theme.palette.primary.text,
    padding: '.5em 1em',
    textTransform: 'uppercase',
    '&:hover': {backgroundColor: theme.palette.primary.dark},
  },

  icon: {
    borderRadius: '50%',
    height: 40,
    justifyContent: 'center',
    width: 40,
    '&:hover': {backgroundColor: theme.palette.primary.dark},
    '& img': {height: 20, width: 20},
  },
});


class Button extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    component: PropTypes.element,
    variant: PropTypes.string,
  };

  render() {
    const { classes, component='button', variant='default', ...properties } = this.props;
    const type = variant.toLowerCase();
    return React.createElement(component, {...properties, className: classNames(
      'dydu-button', `dydu-button-${type}`, classes.base, classes[type]
    )});
  }
}


export default withStyles(styles)(Button);
