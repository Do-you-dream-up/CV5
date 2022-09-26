import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function LongText({ fieldInstance }) {
  const id = fieldInstance.getId();
  const label = fieldInstance.getLabel();

  return (
    <fieldset {...fieldInstance.getDataAttributes()}>
      <legend>{fieldInstance.getLabel()}</legend>
      <label hidden={true} htmlFor={id}>
        {label}
      </label>
      <input id={id} cols="40" type="text" />
    </fieldset>
  );
}

LongText.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
