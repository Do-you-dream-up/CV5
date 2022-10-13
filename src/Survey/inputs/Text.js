import React, { useState, useCallback, useMemo } from 'react';
import Field from '../Field';
import PropTypes from 'prop-types';

export default function Text({ fieldInstance }) {
  const id = fieldInstance.getId();
  const label = fieldInstance.getLabel();

  const [text, setText] = useState('');

  const handleOnChange = useCallback((event) => {
    event.stopPropagation();
    setText(event.target.value);
  }, []);

  const datasetAttributesProps = useMemo(
    () => ({
      ...fieldInstance.getDataAttributes(),
      'data-value': text,
    }),
    [text, fieldInstance],
  );

  return (
    <fieldset {...datasetAttributesProps}>
      <legend>{label}</legend>
      <input id={id} type="text" value={text} onChange={handleOnChange} />
    </fieldset>
  );
}

Text.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
