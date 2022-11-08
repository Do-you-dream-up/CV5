import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

export default function FieldBlock({ field, children }) {
  return field.isRoot() ? <article>{children}</article> : <div>{children}</div>;
}

FieldBlock.propTypes = {
  field: PropTypes.instanceOf(Field),
  children: PropTypes.element,
};
