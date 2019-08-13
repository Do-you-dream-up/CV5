import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


/**
 * Re-usable button component.
 *
 * An icon button typically accepts an image as its child while the default
 * variant is best used with text.
 */
export class Button extends React.PureComponent {

  static defaultProps = {
    component: 'button',
    variant: 'default',
  };

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    component: PropTypes.node,
    flat: PropTypes.bool,
    /** @ignore */
    reference: PropTypes.exact({current: PropTypes.object}),
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


const ForwardedButton = React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
ForwardedButton.displayName = Button.displayName;
export default withStyles(styles)(ForwardedButton);
