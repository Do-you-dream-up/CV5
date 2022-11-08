import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import FieldBlock from '../FieldBlock';
import Field from '../Field';

export default function Radio({ field }) {
  const ref = useRef();

  const onChange = useCallback(() => {
    const isChecked = ref.current.checked;
    if (isChecked) field.saveAsUserAnswer();
    else field.unsetAsUserAnswer();
  }, [field]);

  const inputAttributes = useMemo(() => {
    return {
      ref: ref,
      type: 'radio',
      id: field.getId(),
      onChange,
    };
  }, [onChange, field]);

  const content = useMemo(() => {
    return (
      <>
        <input {...inputAttributes} />
        <label htmlFor={field.getId()}>{field.getLabel()}</label>
      </>
    );
  }, [field, inputAttributes]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

Radio.propTypes = {
  field: PropTypes.instanceOf(Field),
};
