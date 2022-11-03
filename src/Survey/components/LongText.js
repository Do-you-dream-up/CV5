import React, { useCallback, useMemo } from 'react';

import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function LongText({ field }) {
  console.log('text', field?.getId());

  const onChange = useCallback(
    (event) => {
      const userInputString = event.target.value;
      field.saveAsUserAnswer(userInputString);
    },
    [field],
  );

  const inputTextAttributes = useMemo(() => {
    return {
      onChange,
      maxLength: 200,
    };
  }, [onChange]);

  const content = useMemo(() => {
    return (
      <>
        <p>{field.getLabel()}</p>
        <input {...inputTextAttributes} />
      </>
    );
  }, [field, inputTextAttributes]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

LongText.propTypes = {
  field: PropTypes.instanceOf(Field),
};
