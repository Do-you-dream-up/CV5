import React from 'react';
import { useTranslation } from 'react-i18next';
import Interaction from  '../Interaction';


/**
 * Display a form and enable consulting space selection.
 */
export default function Spaces() {

  const { ready, t } = useTranslation('spaces');
  const welcome = t('welcome', {defaultValue: null});

  const form = 'Spaces';

  const text = [...(welcome ? [welcome] : []), form].join('<hr />');

  console.log(ready);
  return ready && (
    <Interaction className="dydu-interaction-spaces" text={text} thinking type="response" />
  );
}
