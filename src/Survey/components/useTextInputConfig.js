import { useRef } from 'react';

export function useTextInputConfig() {
  const commonAttributes = useRef({
    root: {
      maxLength: 200,
      placeholder: 'Saisissez votre réponse ici.',
    },
    style: {
      width: '100%',
      padding: '.5rem',
    },
  });
  return {
    attributes: commonAttributes.current,
  };
}
