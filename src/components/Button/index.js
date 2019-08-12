import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


class Button extends React.PureComponent {

  static defaultProps = {
    component: 'button',
    variant: 'default',
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    component: PropTypes.node,
    flat: PropTypes.bool,
    reference: PropTypes.object,
    variant: PropTypes.oneOf(['default', 'icon']),
  };

  render() {
    const { classes, component, flat, reference, variant, ...rest } = this.props;
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
