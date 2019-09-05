import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * A wizard field to live-edit the configuration.
 */
export default withStyles(styles)(class WizardField extends React.PureComponent {

  static contextType = ConfigurationContext;

  static defaultProps = {
    component: 'div',
  };

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    component: PropTypes.elementType,
    label: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  };

  /**
   * Forge an input based on the type of its value and return it.
   *
   * @param {string} label - Label of the field.
   * @param {*} value - Initial value of the field.
   * @param {function} onChange - Change handler.
   * @returns {Object}
   * @public
   */
  makeField = (label, value, onChange) => {
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
          {React.createElement(component, {name: label, onChange, ...attributes})}
        </span>
      </label>
    );
  };

  /**
   * Field change handler.
   *
   * @param {string} parent - Parent path within the configuration.
   * @param {string} key - Sub-key path within the configuration.
   * @param {Object} event - DOM event.
   * @public
   */
  onChange = (parent, key) => event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.context.update(parent, key, value);
  };

  render() {
    const { component, label, parent, value } = this.props;
    const onChange = this.onChange(parent, label);
    return React.createElement(component, null, this.makeField(label, value, onChange));
  }
});
