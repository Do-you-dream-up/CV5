import Field from '../Field';
import MessageRequired from '../MessageRequired';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

export default function MultipleChoice({ field }) {
  const content = useMemo(() => field.renderChildren(), [field]);
  return (
    <div>
      <label className={'question'} htmlFor={field.getId()}>
        {field.getLabel()}
        <MessageRequired field={field} />
      </label>
      <div id={field.getId()}>{content}</div>
    </div>
  );
}

MultipleChoice.propTypes = {
  field: PropTypes.instanceOf(Field),
};
