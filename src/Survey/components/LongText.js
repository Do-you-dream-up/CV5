import React, { useCallback, useMemo } from 'react';

import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';
import { useTextInputConfig } from './useTextInputConfig';

export default function LongText({ field }) {
  const { attributes } = useTextInputConfig();

  const onChange = useCallback(
    (event) => {
      const userInputString = event.target.value;
      field.saveAsUserAnswer(userInputString);
    },
    [field],
  );

  const inputTextAttributes = useMemo(() => {
    return {
      ...attributes.root,
      onChange,
      maxLength: 200,
      rows: 5,
      style: attributes.style,
    };
  }, [onChange]);

  const content = useMemo(() => {
    return (
      <div className={'long-text'}>
        <p>{field.getLabel()}</p>
        <textarea {...inputTextAttributes} />
      </div>
    );
  }, [field, inputTextAttributes]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

LongText.propTypes = {
  field: PropTypes.instanceOf(Field),
};
