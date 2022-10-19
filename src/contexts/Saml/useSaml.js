/* eslint-disable no-unused-vars */
import { useContext, useEffect } from 'react';

import { ConfigurationContext } from '../ConfigurationContext';
import { SamlContext } from './SamlProvider';
import dydu from '../../tools/dydu';
import { useIdleTimer } from 'react-idle-timer';

const useSaml = () => {
  const { configuration } = useContext(ConfigurationContext);
  const { saml2Info, setSaml2Info } = useContext(SamlContext);
  console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ setSaml2Info', setSaml2Info);
  console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ saml2Info', saml2Info);

  const redirectTourl = (url) => (window.location.href = url);

  const checkSession = () =>
    (async () => {
      try {
        dydu.saml2Auth().then((response) => {
          // response.data.redirection_url
          // response.data.auth
          console.log('response', response);
        });
      } catch (error) {
        console.error(error);
      }
    })();

  useEffect(() => {
    if (configuration.saml?.enable) {
      checkSession();
    }
  }, []);

  const attemptSamlLogin = () => console.log('attemptSamlLogin');

  useIdleTimer({
    debounce: 500,
    onIdle: () => checkSession(),
    timeout: 30 * 60 * 1000, // 2H in milliseconds
  });

  return { attemptSamlLogin, checkSession };
};

export default useSaml;
