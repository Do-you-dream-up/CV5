import React from 'react';
export default function InputLongText() {
  return <input type="text" />;
}

InputLongText.formatProps = (surveyField) => {
  console.log('formatProps', surveyField);
  return surveyField;
};
