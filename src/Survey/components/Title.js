import React, { useCallback, useEffect, useMemo } from 'react';
import { isDefined } from '../../tools/helpers';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Title({ field }) {
  console.log('title', field?.getId());
  useEffect(() => {
    if (isDefined(field)) field.saveAsUserAnswer();
  }, [field]);

  const text = useMemo(() => field?.getLabel(), [field]);

  const render = useCallback(() => {
    return field.isRoot() ? <article>{text}</article> : <div>{text}</div>;
  }, [field, text]);

  return render();
}

Title.propTypes = {
  field: PropTypes.instanceOf(Field),
};
