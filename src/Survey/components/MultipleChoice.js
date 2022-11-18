import React, { useMemo } from 'react';

import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function MultipleChoice({ field }) {
  const content = useMemo(() => field.renderChildren(), [field]);
  const multipleChoiceLabel = useMemo(() => field.getLabel(), [field]);
  return (
    <div>
      <p className={'query'}>{multipleChoiceLabel}</p>
      <FieldBlock field={field}>{content}</FieldBlock>
    </div>
  );
}

MultipleChoice.propTypes = {
  field: PropTypes.instanceOf(Field),
};
