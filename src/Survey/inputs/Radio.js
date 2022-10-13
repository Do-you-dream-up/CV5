import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import Select from './Select';

export default function Radio({ fieldInstance, onChange, checked = false }) {
  const label = useMemo(() => fieldInstance.getLabel(), [fieldInstance]);

  const handleOnChange = useCallback(
    (e) => {
      onChange(fieldInstance.getId(), e);
    },
    [fieldInstance, onChange],
  );

  const inputProps = useMemo(() => {
    const props = {
      type: 'radio',
      name: label,
      onChange: handleOnChange,
      checked,
    };
    return props;
  }, [checked, label, handleOnChange]);

  const datasetAttributesProps = useMemo(() => {
    return {
      ...fieldInstance.getDataAttributes(),
      'data-value': checked ? fieldInstance?.getLabel() : null,
    };
  }, [fieldInstance, checked]);

  return (
    <div {...datasetAttributesProps}>
      <label>
        <input {...inputProps} /> {label}
      </label>
    </div>
  );
}

Radio.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};
