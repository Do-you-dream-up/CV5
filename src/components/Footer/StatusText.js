/* eslint-disable */
import React from 'react';
import { useDialog } from '../../contexts/DialogContext';
import { isDefined } from '../../tools/helpers';

const StatusText = () => {
  const { statusText } = useDialog();

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
