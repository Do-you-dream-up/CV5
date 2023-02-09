import Field from '../Field';
import PropTypes from 'prop-types';

export default function SelectOption({ field }) {
  return <option value={field.getId()}>{field.getLabel()}</option>;
}

SelectOption.propTypes = {
  field: PropTypes.instanceOf(Field),
};
