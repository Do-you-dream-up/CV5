import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import Field from '../Field';
import { useTextInputConfig } from './useTextInputConfig';
import MessageRequired from '../MessageRequired';

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
    const value = field.getUserAnswerValue()?.value;
    return {
      ...attributes.root,
      style: { ...attributes.style, height: '2.3rem' },
      value,
      onChange,
    };
  }, [onChange]);

  return (
    <div className={'text'}>
      <p className={'question'}>
        {field.getLabel()}
        <MessageRequired field={field} />
      </p>
      <input {...inputTextAttributes} />
    </div>
  );
}

Text.propTypes = {
  field: PropTypes.instanceOf(Field),
};
