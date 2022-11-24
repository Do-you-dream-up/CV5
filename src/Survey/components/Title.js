import React, { useEffect, useMemo } from 'react';
import { isDefined } from '../../tools/helpers';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Title({ field }) {
  useEffect(() => {
    if (isDefined(field)) field.saveAsUserAnswer();
  }, [field]);

  const text = useMemo(() => field?.getLabel(), [field]);

  return <h1 className="title">{text}</h1>;
}

Title.propTypes = {
  field: PropTypes.instanceOf(Field),
};
