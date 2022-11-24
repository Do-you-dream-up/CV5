import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function SelectOption({ field }) {
  return <option value={field.getId()}>{field.getLabel()}</option>;
}

SelectOption.propTypes = {
  field: PropTypes.instanceOf(Field),
};
