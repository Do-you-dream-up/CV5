import { useCallback, useMemo, useState } from 'react';

import Field from '../Field';
import MessageRequired from '../MessageRequired';
import { useTextInputConfig } from './useTextInputConfig';
import { useTranslation } from 'react-i18next';

export default function Text({ field }) {
  const { t } = useTranslation();
  const { attributes } = useTextInputConfig(t);
  const [value, setValue] = useState<string | undefined>(field.userAnswerValue?.value);

  const onChange = useCallback(
    (event) => {
      const userInputString = event.target.value;
      setValue(userInputString);
      field.saveAsUserAnswer(userInputString);
    },
    [field],
  );

  const inputTextAttributes = useMemo(() => {
    setValue(field.userAnswerValue?.value);
    return {
      ...attributes.root,
      style: { ...attributes.style, height: '2.3rem' },
      value: value,
      onChange,
      id: field.getId(),
    };
  }, [onChange, field.userAnswerValue?.value]);

  return (
    <div className={'text'}>
      <label className={'question'} htmlFor={field.getId()}>
        {field.getLabel()}
        <MessageRequired field={field} />
      </label>
      <input {...inputTextAttributes} />
    </div>
  );
}
