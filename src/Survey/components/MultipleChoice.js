import React, { useMemo } from 'react';

import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function MultipleChoice({ field }) {
  const content = useMemo(() => field.renderChildren(), [field]);

  return <FieldBlock field={field}>{content}</FieldBlock>;
}

MultipleChoice.propTypes = {
  field: PropTypes.instanceOf(Field),
};
