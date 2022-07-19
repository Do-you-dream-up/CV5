import React from 'react';

export default function Checkbox() {
  return (
    <>
      <input type="checkbox" id="scales" name="scales" checked />
      <label htmlFor="scales">Scales</label>
    </>
  );
}

Checkbox.formatProps = (surveyField) => {
  console.log('formatProps', surveyField);
  return surveyField;
};
