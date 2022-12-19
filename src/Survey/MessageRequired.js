import React from 'react';
import PropTypes from 'prop-types';

import useMessageFieldRequired from './hooks/useMessageFieldRequired';
import { isDefined } from '../tools/helpers';
import Field from './Field';

export default function MessageRequired({ show, field }) {
  const { message } = useMessageFieldRequired(field, show);
  return !isDefined(message) ? null : <i className={'message-field-required'}>{message}</i>;
}

MessageRequired.propTypes = {
  field: PropTypes.instanceOf(Field),
  show: PropTypes.bool,
};
