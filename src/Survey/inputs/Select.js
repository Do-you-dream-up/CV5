import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

export default function Select({ id, label, required, onSelect, optionList }) {
  const optionIdList = useMemo(() => optionList.map(({ id: optionId }) => optionId), [optionList]);

  const onChange = useCallback(
    (e) => {
      onSelect(id, e.target.value, optionIdList);
    },
    [onSelect, optionIdList, id],
  );

  const options = useMemo(() => {
    if (!optionList || optionList.length === 0) return [];
    return optionList.map((field) => {
      return (
        <option key={field.id} id={field.id} value={field.id}>
          {field.label}
        </option>
      );
    });
  }, [optionList]);

  return (
    <>
      <h1>{label}</h1>
      <label hidden htmlFor={label}>
        {label}
      </label>

      <select name={label} id={id} onChange={onChange}>
        <option value="">--Please choose an option--</option>
        {options}
      </select>
    </>
  );
}

Select.formatProps = (field, onSelect) => {
  return {
    id: field.id,
    label: field.label,
    required: field.mandatory || false,
    onSelect,
    optionList: field?.children || [],
  };
};

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onSelect: PropTypes.func,
  optionList: PropTypes.array,
};
