/* eslint-disable */
import React from 'react';
import { Option, InputContainer, Label, Select as SelectStyled } from './styled';
import PropTypes from 'prop-types';

export default function Select() {
  return <p>select</p>;
  /*
  return (
    <InputContainer>
      <Label htmlFor="pet-select">{label}</Label>
      <SelectStyled name="pets" id="pet-select">
        {list.map((option) => (
          <Option value={option.value}>{option.label}</Option>
        ))}
      </SelectStyled>
    </InputContainer>
  );
   */
}

Select.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
  label: PropTypes.string,
};

Select.formatProps = (surveyField) => {
  console.log('formatProps', surveyField);
  return surveyField;
};
