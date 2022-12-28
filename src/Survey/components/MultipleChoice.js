import React, { useMemo } from 'react';

import FieldBlock from '../FieldBlock';
import PropTypes from 'prop-types';
import Field from '../Field';
import MessageRequired from '../MessageRequired';

export default function MultipleChoice({ field }) {
  const content = useMemo(() => field.renderChildren(), [field]);
  return (
    <div>
      <p className={'question'}>
        {field.getLabel()}
        <MessageRequired field={field} />
      </p>
      <FieldBlock field={field}>{content}</FieldBlock>
    </div>
  );
}

MultipleChoice.propTypes = {
  field: PropTypes.instanceOf(Field),
};
