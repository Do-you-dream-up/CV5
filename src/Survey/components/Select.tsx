import { useCallback, useEffect, useMemo, useState } from 'react';

import MessageRequired from '../MessageRequired';
import { isDefined } from '../../tools/helpers';
import Field from '../Field';

export default function Select({ field }) {
  const [currentOptionFieldInstance, setCurrentOptionFieldInstance] = useState<Field>();

  useEffect(() => {
    const shouldInit = !isDefined(currentOptionFieldInstance) && isDefined(field);
    if (shouldInit) setCurrentOptionFieldInstance(field.getFirstChild());
  }, [field, currentOptionFieldInstance]);

  useEffect(() => {
    if (isDefined(currentOptionFieldInstance)) {
      currentOptionFieldInstance?.saveAsUserAnswer(currentOptionFieldInstance?.userAnswerValue?.value);
    }
  }, [currentOptionFieldInstance, field]);

  const replaceCurrentOptionFieldInstance = useCallback(
    (optionFieldInstance) => {
      if (isDefined(currentOptionFieldInstance)) currentOptionFieldInstance?.unsetAsUserAnswer();
      setCurrentOptionFieldInstance(optionFieldInstance);
    },
    [currentOptionFieldInstance],
  );

  const onChange = useCallback(
    (event) => {
      const optionId = event.target.value;
      const optionFieldInstance = field.find(optionId);
      replaceCurrentOptionFieldInstance(optionFieldInstance);
    },
    [field, replaceCurrentOptionFieldInstance],
  );

  const selectAttributes = useMemo(() => {
    return {
      onChange,
    };
  }, [onChange]);

  const options = useMemo(() => {
    return isDefined(field) ? field.renderChildren() : null;
  }, [field]);

  const slaves = useMemo(() => {
    return isDefined(currentOptionFieldInstance) ? currentOptionFieldInstance?.renderSlaves() : null;
  }, [currentOptionFieldInstance]);

  return (
    <div>
      <label className={'question'} htmlFor={field.getId()}>
        {field.getLabel()}
        <MessageRequired field={field} />
      </label>
      <select {...selectAttributes} id={field.getId()}>
        {options}
      </select>
      {slaves && <div className="slaves">{slaves}</div>}
    </div>
  );
}
