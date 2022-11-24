import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import { useTextInputConfig } from './useTextInputConfig';

export default function Text({ field }) {
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
      style: { ...attributes.style, height: '2.3rem' },
      onChange,
    };
  }, [onChange]);

  return (
    <div className={'text'}>
      <p>{field.getLabel()}</p>
      <input {...inputTextAttributes} />
    </div>
  );
}

Text.propTypes = {
  field: PropTypes.instanceOf(Field),
};
