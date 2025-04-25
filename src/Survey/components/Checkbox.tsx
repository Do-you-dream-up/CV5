import { useCallback, useEffect, useMemo, useRef } from 'react';

export default function Checkbox({ field }) {
  const ref = useRef<HTMLInputElement>(null);

  const onChange = useCallback(() => {
    const isChecked = ref.current?.checked;
    if (isChecked) field.saveAsUserAnswer();
    else field.unsetAsUserAnswer();
  }, [field]);

  const inputAttributes = useMemo(() => {
    return {
      type: 'checkbox',
      id: field.getId(),
      onChange,
      ref,
    };
  }, [field, onChange]);

  return (
    <div className={'checkbox'}>
      <label htmlFor={field.getId()}>{field.getLabel()}</label>
      <input {...inputAttributes} id={field.getId()} />
    </div>
  );
}
