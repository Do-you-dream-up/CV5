import debounce from 'debounce-promise';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import WizardFieldStatus from '../WizardFieldStatus';


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

  static status = {
    error: 'error',
    pending: 'pending',
    success: 'success',
  };

  constructor(props) {
    super(props);
    this.state = {value: this.format(props.value), status: this.constructor.status.success};
    this.onUpdate = debounce(this.onUpdate, 300);
  }

  /**
   * Format and add indent to object values.
   *
   * @param {*} value - Value to format.
   * @returns {*}
   * @public
   */
  format = value => {
    if (typeof value === 'object') {
      value = JSON.stringify(value, null, 2);
    }
    return value;
  };

  /**
   * Field change handler.
   *
   * Set the field status to "pending" beforehand.
   *
   * @param {string} parent - Parent path within the configuration.
   * @param {string} key - Sub-key path within the configuration.
   * @param {Object} event - DOM event.
   * @public
   */
  onChange = (parent, key) => event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({status: this.constructor.status.pending, value}, () => {
      this.onUpdate(parent, key, value);
    });
  };


  /**
   * Update the configuration values.
   *
   * @param {string} parent - Parent path within the configuration.
   * @param {string} key - Sub-key path within the configuration.
   * @param {*} value - New value.
   * @public
   */
  onUpdate = (parent, key, value) => {
    if (typeof this.props.value === 'object') {
      try {
        value = JSON.parse(value);
      }
      catch {
        this.setState({status: this.constructor.status.error});
        return;
      }
    }
    else if (typeof this.props.value === 'number') {
      value = ~~value;
    }
    this.context.update(parent, key, value).then(
      () => this.setState({status: this.constructor.status.success})
    );
  };

  render() {
    const { classes, component, label, parent, value: configurationValue } = this.props;
    const { status, value } = this.state;
    const onChange = this.onChange(parent, label);
    const { input='input', ...attributes } = {
      boolean: {checked: value, type: 'checkbox'},
      number: {type: 'number', value: value},
      object: {input: 'textarea', placeholder: label, value: value},
      string: {type: 'text', value: value},
    }[typeof configurationValue] || {};
    return React.createElement(component, null, !!attributes && (
      <label className={classes.field}>
        <div children={label} className={classes.text} />
        <div children={label} className={classes.input}>
          {React.createElement(input, {name: label, onChange, ...attributes})}
        </div>
        <div children={<WizardFieldStatus status={status} />} className={classes.icon}/>
      </label>
    ));
  }
});
