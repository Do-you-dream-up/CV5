import Field from '../Field';
import FieldBlock from '../FieldBlock';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

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
