import { SamlContext } from './SamlProvider';
/* eslint-disable no-unused-vars */
import { useContext } from 'react';

const useSaml = () => {
  const { saml2Info, setSaml2Info, checkSession } = useContext(SamlContext);
  // console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ setSaml2Info', setSaml2Info);
  // console.log('🚀 ~ file: useSaml.js ~ line 11 ~ useSaml ~ saml2Info', saml2Info);

  const redirectTo = (url) => (window.location.href = url);

  const attemptSamlLogin = () => console.log('attemptSamlLogin');

  return { attemptSamlLogin, checkSession };
};

export default useSaml;
