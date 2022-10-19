/* eslint-disable no-unused-vars */
import { useContext, useEffect } from 'react';

import { SamlContext } from './SamlProvider';
import dydu from '../../tools/dydu';
import { useIdleTimer } from 'react-idle-timer';

const useSaml = () => {
  const { saml2Info, setSaml2Info } = useContext(SamlContext);
  console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ setSaml2Info', setSaml2Info);
  console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ saml2Info', saml2Info);

  const redirectTo = (url) => (window.location.href = url);

  const checkSession = () => {
    try {
      new Promise((resolve) => {
        console.log('in');
        dydu.getSaml2Status().then((response) => console.log(response));
        resolve();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const attemptSamlLogin = () => console.log('attemptSamlLogin');

  useIdleTimer({
    debounce: 500,
    onIdle: () => checkSession(),
    timeout: 30 * 60 * 1000, // 2H in milliseconds
  });

  return { attemptSamlLogin, checkSession };
};

export default useSaml;
