import React, { useRef, useCallback, useMemo } from 'react';
import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Checkbox({ field }) {
  const ref = useRef();

  const onChange = useCallback(() => {
    const isChecked = ref.current.checked;
    if (isChecked) field.saveAsUserAnswer();
    else field.unsetAsUserAnswer();
  }, [field]);

  const inputAttributes = useMemo(() => {
    return {
      type: 'checkbox',
      id: field.getId(),
      onChange,
      ref: ref,
    };
  }, [field, onChange]);

  const content = useMemo(() => {
    return (
      <div className={'checkbox'}>
        <input {...inputAttributes} />
        <label htmlFor={field.getId()}>{field.getLabel()}</label>
      </div>
    );
  }, [field, inputAttributes]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

Checkbox.propTypes = {
  field: PropTypes.instanceOf(Field),
};
