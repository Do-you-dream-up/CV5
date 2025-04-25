import { useCallback } from 'react';

import MessageRequired from '../MessageRequired';
import { useTextInputConfig } from './useTextInputConfig';
import { useTranslation } from 'react-i18next';

export default function LongText({ field }) {
  const { t } = useTranslation();
  const { attributes } = useTextInputConfig(t);

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
      defaultValue: field.userAnswerValue?.value,
      maxLength: 200,
      rows: 5,
      style: attributes.style,
      id: field.getId(),
    };
  }, [onChange, field]);

  return (
    <div className={'long-text'}>
      <label className={'question'} htmlFor={field.getId()}>
        {field.getLabel()} <MessageRequired field={field} />
      </label>
      <textarea {...inputTextAttributes()} />
    </div>
  );
}
