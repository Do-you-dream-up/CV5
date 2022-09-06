import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function InputText({ id, label, required = false, onChange }) {
  const handleOnChange = useCallback(
    (e) => {
      const text = e.target.value;
      onChange(id, text);
    },
    [id, onChange],
  );

  const inputProps = useMemo(
    () => ({
      type: 'text',
      id,
      required,
      minLength: '4',
      maxLength: '8',
      size: '10',
      onChange: handleOnChange,
    }),
    [required, id, handleOnChange],
  );

  return (
    <fieldset>
      <legend>{label}</legend>
      <label hidden htmlFor={label}>
        {label}
      </label>
      <input {...inputProps} />
    </fieldset>
  );
}

InputText.formatProps = (field, onChange) => {
  return {
    id: field.id,
    label: field.label,
    required: field.mandatory || false,
    onChange,
  };
};

InputText.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};
