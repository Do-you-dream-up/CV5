import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function Checkbox({ label, required, id, onCheck }) {
  const [checked, setChecked] = useState(false);

  const handleCheck = useCallback(() => {
    setChecked((prev) => {
      const newValue = !prev;
      onCheck(id, newValue);
      return newValue;
    });
    // eslint-disable-next-line
  }, [id]);

  const props = useMemo(
    () => ({
      type: 'checkbox',
      id: id,
      name: label,
      onChange: handleCheck,
      checked: checked,
    }),
    [id, label, handleCheck, checked],
  );

  return (
    <div>
      <input {...props} />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}

Checkbox.formatProps = (field, onCheck) => {
  return {
    id: field.id,
    label: field.label,
    required: field.mandatory || false,
    onCheck,
  };
};

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onCheck: PropTypes.func,
};
