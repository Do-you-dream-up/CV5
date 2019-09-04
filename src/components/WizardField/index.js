import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


/**
 * A wizard field to live-edit the configuration.
 */
export default withStyles(styles)(class WizardField extends React.PureComponent {

  static defaultProps = {
    component: 'div',
  };

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    component: PropTypes.elementType,
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  };

  /**
   * Forge an input based on the type of its value and return it.
   *
   * @param {string} label - Label of the field.
   * @param {*} value - Initial value of the field.
   * @returns {Object}
   * @public
   */
  makeField = (label, value) => {
    const { classes } = this.props;
    const { component='input', ...attributes } = {
      boolean: {checked: value, type: 'checkbox'},
      number: {type: 'number', value: value},
      object: {component: 'textarea', placeholder: label, value: JSON.stringify(value, null, 2)},
      string: {type: 'text', value: value},
    }[typeof value] || {};
    return !!attributes && (
      <label className={classes.field}>
        <span children={label} className={classes.text} />
        <span children={label} className={classes.input}>
          {React.createElement(component, {name: label, readOnly: true, ...attributes})}
        </span>
      </label>
    );
  };

  render() {
    const { component, label, value } = this.props;
    return React.createElement(component, null, this.makeField(label, value));
  }
});
