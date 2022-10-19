import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function SelectOption({ fieldInstance }) {
  return (
    <option value={fieldInstance.getId()} {...fieldInstance.getDataAttributes()}>
      {fieldInstance.getLabel()}
    </option>
  );
}

SelectOption.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
