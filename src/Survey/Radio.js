import React from 'react';

export default function Radio() {
  return (
    <>
      <input type="radio" id="html" name="fav_language" value="HTML" />
      <label htmlFor="html">HTML</label>
    </>
  );
}

Radio.formatProps = (surveyField) => {
  console.log('formatProps', surveyField);
  return surveyField;
};
