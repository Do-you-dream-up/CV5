import PropTypes from 'prop-types';
import Input from './Input';

export const Field = PropTypes.shape({
  id: PropTypes.number,
  label: PropTypes.string,
  type: PropTypes.string,
  mandatory: PropTypes.bool,
  children: PropTypes.arrayOf({
    masterOf: PropTypes.arrayOf(PropTypes.number),
    id: PropTypes.number,
    label: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(Input.Types)),
    mandatory: PropTypes.bool,
  }),
});

const Interface = {
  configuration: PropTypes.shape({
    surveyId: PropTypes.string,
    name: PropTypes.string,
    contextId: PropTypes.string,
    title: PropTypes.string,
    fields: PropTypes.arrayOf(Field),
  }),
};

export default Interface;
