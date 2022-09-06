import React, { useMemo } from 'react';
import { SurveyProvider } from './SurveyProvider';
import { isDefined } from '../tools/helpers';

export default function Input({ data, onChange, ...rest }) {
  const TypedInput = useMemo(() => {
    const TypedInputComponent = SurveyProvider.helper.getTypeComponent(data);
    const inputProps = isDefined(TypedInputComponent?.formatProps)
      ? TypedInputComponent?.formatProps(data, onChange)
      : data;
    return TypedInputComponent ? <TypedInputComponent {...inputProps} {...rest} /> : null;
  }, [data, onChange, rest]);

  return TypedInput;
}
