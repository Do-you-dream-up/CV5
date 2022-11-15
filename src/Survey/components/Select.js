import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isDefined } from '../../tools/helpers';
import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';

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
        <select {...selectAttributes}>{options}</select>
        {slaves}
      </>
    );
  }, [selectAttributes, options, slaves]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

Select.propTypes = {
  field: PropTypes.instanceOf(Field),
};
