import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { isDefined } from '../../tools/helpers';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function RadioGroup({ fields }) {
  const [current, setCurrent] = useState();

  const isCurrentActive = useCallback((field) => current?.hasId(field.getId()), [current]);

  useEffect(() => {
    if (!isDefined(current)) return;

    fields.forEach((field) => {
      if (isCurrentActive(field)) field.saveAsUserAnswer();
      else field.unsetAsUserAnswer();
    });
  }, [current, isCurrentActive, fields]);

  const onChange = useCallback(
    (selectedFieldInstance) => {
      if (!isDefined(current)) return setCurrent(selectedFieldInstance);
      const alreadySelected = isCurrentActive(selectedFieldInstance);
      if (alreadySelected) return;
      setCurrent(selectedFieldInstance);
    },
    [isCurrentActive, current],
  );

  const render = useCallback(() => {
    return fields.map((field) => (
      <RadioItem key={field.getId()} field={field} onChange={onChange} checked={isCurrentActive(field)} />
    ));
  }, [isCurrentActive, onChange, fields]);

  return <>{render()}</>;
}

const RadioItem = ({ field, onChange, checked }) => {
  const inputAttributes = useMemo(() => {
    return {
      id: field.getId(),
      type: 'radio',
      onChange: () => onChange(field),
      checked,
    };
  }, [onChange, field, checked]);

  return (
    <div>
      <input {...inputAttributes} />
      <label htmlFor={field.getId()}>{field.getLabel()}</label>
    </div>
  );
};

RadioItem.propTypes = {
  field: PropTypes.instanceOf(Field),
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

RadioGroup.propTypes = {
  fields: PropTypes.arrayOf(Field),
};
