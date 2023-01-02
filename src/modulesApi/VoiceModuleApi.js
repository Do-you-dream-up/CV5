/* eslint-disable no-undef */
import React from 'react';
import { isDefined } from '../../dydu-module/helpers';

<import-voice />;

const VoiceModule = (props) => {
  try {
    // eslint-disable-next-line react/jsx-no-undef
    return <Voice {...props} />;
  } catch (e) {
    return null;
  }
};

VoiceModule.isEnabled = isDefined(VoiceModule());

export default VoiceModule;
