import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

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

  return (
    <div className={'radio'}>
      <input {...inputAttributes} />
      <label htmlFor={field.getId()}>{field.getLabel()}</label>
    </div>
  );
}

Radio.propTypes = {
  field: PropTypes.instanceOf(Field),
};
