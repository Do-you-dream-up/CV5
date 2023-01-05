import Field from './Field';
import PropTypes from 'prop-types';
import { isDefined } from '../tools/helpers';
import useMessageFieldRequired from './hooks/useMessageFieldRequired';

export default function MessageRequired({ show, field }) {
  const { message } = useMessageFieldRequired(field, show);
  return !isDefined(message) ? null : <i className={'message-field-required'}>{message}</i>;
}

MessageRequired.propTypes = {
  field: PropTypes.instanceOf(Field),
  show: PropTypes.bool,
};
