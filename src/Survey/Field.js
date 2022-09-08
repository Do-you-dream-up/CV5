import React, { useState, useCallback, useMemo } from 'react';
import { isDefined, isEmptyString } from '../tools/helpers';
import { useSurvey } from './SurveyProvider';
import Input from './Input';
import PropTypes from 'prop-types';

export default function Field({ field }) {
  const { getFieldSlaves, updateField } = useSurvey();
  const [slaves, setSlaves] = useState(null);

  const onSlaveChange = useCallback(
    (id, value, ...rest) => {
      updateField(id, value, ...rest);
    },
    [updateField],
  );

  const onFieldChange = useCallback(
    (id, value, ...rest) => {
      console.log('Field: field changed', id, value);
      const isIdValidId = isDefined(id) && !isEmptyString(id);
      if (!isIdValidId) {
        return setSlaves(null);
      }
      const _slaves = getFieldSlaves(value);
      console.log('found slaves', id, _slaves);
      updateField(id, value, ...rest);
      if (_slaves.length > 0) setSlaves(_slaves);
    },
    [updateField, getFieldSlaves],
  );

  const Slaves = useMemo(() => {
    return !isDefined(slaves)
      ? null
      : slaves.map((_field) => <Input key={_field.id} data={_field} onChange={onSlaveChange} />);
  }, [slaves, onSlaveChange]);

  return (
    <div style={Style.container}>
      <Input data={field} onChange={onFieldChange} />
      {Slaves}
    </div>
  );
}

const Style = {
  container: {
    marginBottom: '1rem',
    padding: '.5rem',
    backgroundColor: '#3131',
  },
};

Field.propTypes = {
  field: PropTypes.any,
};
