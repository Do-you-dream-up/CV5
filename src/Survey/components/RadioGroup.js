import { useCallback, useEffect, useMemo, useState } from 'react';

import Field from '../Field';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';

export default function RadioGroup({ showRequiredMessage, fields, parent }) {
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
      if (!alreadySelected) setCurrent(selectedFieldInstance);
    },
    [isCurrentActive, current],
  );

  const render = useCallback(() => {
    return (
      <>
        <p className={'question'}>
          {parent.getLabel()}
          <MessageRequired show={showRequiredMessage} field={parent} />
        </p>
        {fields.map((field) => (
          <RadioItem key={field.getId()} field={field} onChange={onChange} checked={isCurrentActive(field)} />
        ))}
      </>
    );
  }, [isCurrentActive, onChange, fields]);

  return <div className={'group'}>{render()}</div>;
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
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Field)),
  parent: PropTypes.instanceOf(Field),
  showRequiredMessage: PropTypes.bool,
};
