import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function InputLongText({ id, label, required = false, onChange }) {
  const handlOnChange = useCallback(
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
      cols: '40',
      rows: '8',
      onChange: handlOnChange,
    }),
    [required, id, handlOnChange],
  );

  return (
    <>
      <h1>{label}</h1>
      <label hidden htmlFor={label}>
        {label}
      </label>
      <textarea {...inputProps} />
    </>
  );
}

InputLongText.formatProps = (field, onChange) => {
  return {
    id: field.id,
    label: field.label,
    required: field.mandatory || false,
    onChange,
  };
};

InputLongText.propTypes = {
  id: PropTypes.number,
  label: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};
