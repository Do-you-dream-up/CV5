import Field from './Field';
import PropTypes from 'prop-types';

export default function FieldBlock({ field, children }) {
  return field.isRoot() ? <article>{children}</article> : <div>{children}</div>;
}

FieldBlock.propTypes = {
  field: PropTypes.instanceOf(Field),
  children: PropTypes.element,
};
