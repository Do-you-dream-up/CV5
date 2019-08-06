import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';


const styles = theme => ({

  base: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    outline: 'none',
    padding: 0,
    '& > *:not(:first-child)': {
      marginLeft: '.5em',
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabled,
      cursor: 'not-allowed',
    },
  },

  default: {
    borderRadius: 4,
    color: theme.palette.primary.text,
    padding: '.5em 1em',
    textTransform: 'uppercase',
    '&:hover:not(:disabled)': {backgroundColor: theme.palette.primary.dark},
  },

  flat: {
    background: 0,
  },

  icon: {
    borderRadius: '50%',
    height: 40,
    justifyContent: 'center',
    width: 40,
    '&:hover:not(:disabled)': {backgroundColor: theme.palette.primary.dark},
    '& img': {height: 20, width: 20},
  },
});


class Button extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    component: PropTypes.element,
    flat: PropTypes.bool,
    reference: PropTypes.object,
    variant: PropTypes.oneOf(['default', 'icon']),
  };

  render() {
    const { classes, component='button', flat, reference, variant='default', ...rest } = this.props;
    const type = variant.toLowerCase();
    return React.createElement(component, {
      ...rest,
      className: classNames(
        'dydu-button',
        `dydu-button-${type}`,
        classes.base,
        classes[type],
        {[classes.flat]: flat},
      ),
      ref: reference,
    });
  }
}


const forwardedButton = React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
forwardedButton.displayName = Button.displayName;
export default withStyles(styles)(forwardedButton);
