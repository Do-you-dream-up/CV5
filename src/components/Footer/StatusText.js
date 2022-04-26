/* eslint-disable */
import React, { useEffect } from 'react';
import { useDialog } from '../../contexts/DialogContext';
import { isDefined } from '../../tools/helpers';

const StatusText = () => {
  const { statusText, flushStatusText } = useDialog();

  useEffect(() => {
    if (!isDefined(statusText)) return;
    setTimeout(flushStatusText, 1500);
  }, [flushStatusText]);

  return !isDefined(statusText) || statusText.length === 0 ? null : (
    <div style={Style.main}>
      <p>{statusText}</p>
    </div>
  );
};
export default StatusText;

const Style = {
  main: {
    backgroundColor: '#3131',
    color: 'rgba(0,0,0,.8)',
    padding: '0 1em',
  },
};
