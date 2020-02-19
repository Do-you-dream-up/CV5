import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import useDebounce from '../../tools/hooks/debounce';
import usePrevious from '../../tools/hooks/previous';
import WizardFieldStatus from '../WizardFieldStatus';
import useStyles from './styles';


/**
 * A wizard field to live-edit the configuration.
 */
function WizardField({ component, label, onSave, parent, value: oldValue }) {

  const { update } = useContext(ConfigurationContext);
  const classes = useStyles();
  const [ error, setError ] = useState(null);
  const [ status, setStatus ] = useState(WizardField.status.success);
  const [ value, setValue ] = useState(null);
  const [ ready, setReady ] = useState(false);
  const debouncedValue = useDebounce(value, 300);
  const previousValue = usePrevious(debouncedValue);

  const format = newValue => {
    if (typeof newValue === 'object') {
      newValue = JSON.stringify(newValue, null, 2);
    }
    return newValue;
  };

  const onChange = event => {
    const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setError(null);
    setStatus(WizardField.status.pending);
    setValue(newValue);
  };

  const onUpdate = useCallback(newValue => {
    if (typeof oldValue === 'object') {
      try {
        newValue = JSON.parse(newValue);
      }
      catch ({ message, stack}) {
        // eslint-disable-next-line no-console
        console.warn(stack);
        setError(message);
        setStatus(WizardField.status.error);
        return;
      }
    }
    else if (typeof oldValue === 'number') {
      newValue = ~~newValue;
    }
    update(parent, label, newValue).then(configuration => {
      if (typeof onSave === 'function') {
        onSave(configuration);
      }
      setStatus(WizardField.status.success);
    });
  }, [label, oldValue, onSave, parent, update]);

  useEffect(() => {
    if (ready && previousValue !== null && debouncedValue !== previousValue) {
      onUpdate(debouncedValue);
    }
  }, [debouncedValue, onUpdate, previousValue, ready]);

  useEffect(() => {
    if (!ready) {
      setValue(format(oldValue));
    }
  }, [oldValue, ready]);

  useEffect(() => {
    if (value !== null) {
      setReady(true);
    }
  }, [value]);

  const { input = 'input', ...attributes } = {
    boolean: {checked: value, type: 'checkbox'},
    number: {type: 'number', value},
    object: {input: 'textarea', placeholder: label, value},
    string: {type: 'text', value},
  }[typeof oldValue] || {};
  return ready && React.createElement(component, null, !!attributes && (
    <label className={classes.field}>
      <div children={label} className={classes.text} />
      <div className={classes.input}>
        {React.createElement(input, {name: label, onChange, ...attributes})}
      </div>
      <div children={<WizardFieldStatus error={error} status={status} />} />
    </label>
  ));
}


WizardField.defaultProps = {
  component: 'div',
};


WizardField.propTypes = {
  component: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  parent: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};


WizardField.status = {
  error: 'error',
  pending: 'pending',
  success: 'success',
};


export default WizardField;
