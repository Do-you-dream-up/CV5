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
  render() {
    const { classes, component, variant, ...properties } = this.props;
    return React.createElement(
      component ? component : 'button',
      {...properties, className: classNames(
        'dydu-button',
        `dydu-button-${variant || 'default'}`,
        classes.base,
        classes[variant || 'default'],
      )},
    );
  }
}


Button.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.element,
  variant: PropTypes.string,
};

export default withStyles(styles)(Button);
