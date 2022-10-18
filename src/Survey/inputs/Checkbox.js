import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Checkbox({ fieldInstance }) {
  const label = fieldInstance.getLabel();
  const id = fieldInstance.getId();

  const inputProps = useMemo(() => {
    return {
      type: 'checkbox',
      name: fieldInstance.getLabel(),
      id,
    };
  }, [fieldInstance, id]);

  return (
    <div {...fieldInstance.getDataAttributes()}>
      <label>
        <input {...inputProps} /> {label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
