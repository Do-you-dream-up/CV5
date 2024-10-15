import { useRef } from 'react';

export function useTextInputConfig(t) {
  const commonAttributes = useRef({
    root: {
      maxLength: 200,
      placeholder: t('survey.placeholder'),
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
