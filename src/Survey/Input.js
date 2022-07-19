import React, { useCallback } from 'react';

import { Field } from './Interface';
import Select from './Select';
import PropTypes from 'prop-types';
import Radio from './Radio';
import Checkbox from './Checkbox';
import InputText from './InputText';
import InputLongText from './InputLongText';

const Types = {
  selectOption: 'SELECT_OPTION',
  select: 'SELECT',
  checkbox: 'CHECKBOX',
  multipleChoice: 'MULTIPLE_CHOICE',
  title: 'TITLE',
  text: 'TEXT',
  radio: 'RADIO',
  longText: 'LONG_TEXT',
};

const typeToComponent = {
  [Types.select]: Select,
  [Types.checkbox]: Checkbox,
  [Types.radio]: Radio,
  [Types.text]: InputText,
  [Types.longText]: InputLongText,
};

export default function Input({ field, onUpdate }) {
  const renderInput = useCallback(() => {
    const InputComponent = typeToComponent[field.type];
    console.log({ field, InputComponent });
    const props = InputComponent.formatProps(field, onUpdate);
    return <InputComponent {...props} />;
  }, [field, onUpdate]);

  return renderInput();
}

Input.propTypes = {
  field: Field,
  onUpdate: PropTypes.func,
};

Input.Types = { ...Types };
