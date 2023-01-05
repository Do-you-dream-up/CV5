import { useCallback, useMemo } from 'react';

import Field from '../Field';
import FieldBlock from '../FieldBlock';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
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

  const inputTextAttributes = useCallback(() => {
    return {
      ...attributes.root,
      onChange,
      defaultValue: field.getUserAnswerValue()?.value,
      maxLength: 200,
      rows: 5,
      style: attributes.style,
    };
  }, [onChange, field]);

  const content = useMemo(() => {
    return (
      <div className={'long-text'}>
        <p className={'question'}>
          {field.getLabel()}
          <MessageRequired field={field} />
        </p>
        <textarea {...inputTextAttributes()} />
      </div>
    );
  }, [field, inputTextAttributes]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

LongText.propTypes = {
  field: PropTypes.instanceOf(Field),
};
