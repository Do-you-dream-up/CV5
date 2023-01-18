import { useCallback, useEffect, useMemo, useState } from 'react';

import Field from '../Field';
import FieldBlock from '../FieldBlock';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';

export default function Select({ field }) {
  const [currentOptionFieldInstance, setCurrentOptionFieldInstance] = useState();

  useEffect(() => {
    const shouldInit = !isDefined(currentOptionFieldInstance) && isDefined(field);
    if (shouldInit) setCurrentOptionFieldInstance(field.getFirstChild());
  }, [field, currentOptionFieldInstance]);

  useEffect(() => {
    if (isDefined(currentOptionFieldInstance)) currentOptionFieldInstance.saveAsUserAnswer();
  }, [currentOptionFieldInstance, field]);

  const replaceCurrentOptionFieldInstance = useCallback(
    (optionFieldInstance) => {
      if (isDefined(currentOptionFieldInstance)) currentOptionFieldInstance.unsetAsUserAnswer();
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
    return isDefined(currentOptionFieldInstance) ? currentOptionFieldInstance.renderSlaves() : null;
  }, [currentOptionFieldInstance]);

  const content = useMemo(() => {
    return (
      <>
        <p className={'question'}>
          {field.getLabel()}
          <MessageRequired field={field} />
        </p>
        <select {...selectAttributes}>{options}</select>
        <div className="slaves">{slaves}</div>
      </>
    );
  }, [selectAttributes, options, slaves]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

Select.propTypes = {
  field: PropTypes.instanceOf(Field),
};
