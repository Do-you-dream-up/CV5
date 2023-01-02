import { useEffect, useMemo } from 'react';

import Field from '../Field';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';

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
