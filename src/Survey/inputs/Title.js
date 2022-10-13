import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Title({ fieldInstance }) {
  return <h1 {...fieldInstance.getDataAttributes()}>{fieldInstance.getLabel()}</h1>;
}
Title.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
