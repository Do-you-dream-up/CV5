import React from 'react';

export default function InputText() {
  return <input type="text" />;
}

InputText.formatProps = (surveyField) => {
  console.log('formatProps', surveyField);
  return surveyField;
};
