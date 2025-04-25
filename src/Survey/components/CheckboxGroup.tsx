import { useCallback } from 'react';

import Field from '../Field';
import MessageRequired from '../MessageRequired';
import Checkbox from './Checkbox';

type FieldType = InstanceType<typeof Field>;

interface CheckboxGroupProps {
  showRequiredMessage: boolean;
  fields: FieldType[];
  parent: FieldType;
}

export default function CheckboxGroup({ showRequiredMessage, fields, parent }: CheckboxGroupProps) {
  const render = useCallback(() => {
    return (
      <fieldset>
        <legend className={'question'}>
          {parent.getLabel()}
          <MessageRequired show={showRequiredMessage} field={parent} />
        </legend>
        {fields.map((field) => (
          <Checkbox key={field.getId()} field={field} />
        ))}
      </fieldset>
    );
  }, [fields]);

  return <div className={'group'}>{render()}</div>;
}
