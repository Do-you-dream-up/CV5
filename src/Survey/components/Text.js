import { useCallback, useMemo } from 'react';

import Field from '../Field';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
import { useTextInputConfig } from './useTextInputConfig';
import { useTranslation } from 'react-i18next';

export default function Text({ field }) {
  const { t } = useTranslation();
  const { attributes } = useTextInputConfig(t);

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
