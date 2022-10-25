/* eslint-disable no-undef */
import React from 'react';

/**
 * Conditionnal export:
 *
 * A piece of code is automaticaly injected in this file by webpack (OidcModule.js)
 * if oidc has been enabled.
 */

<import-oidc-module />;

// eslint-disable-next-line no-unused-vars
import configuration from '../../public/override/configuration.json';
import { isDefined } from '../../dydu-module/helpers';

<auth-context-code />;

/**
 * The Above code checks if webpack has injected the oidc code
 */

// eslint-disable-next-line react/prop-types
const DummyWrapper = ({ children }) => <>{children}</>;
const NullFunction = () => null;

const getAuthPayload = () => {
  try {
    const hasWebpackInjectedOidcAuthCodeString =
      isDefined(AuthContext) && isDefined(Authenticated) && isDefined(useToken);
    if (hasWebpackInjectedOidcAuthCodeString)
      return {
        AuthContext,
        Authenticated,
        useToken,
      };
  } catch (e) {
    return {
      AuthContext: DummyWrapper,
      Authenticated: DummyWrapper,
      useToken: NullFunction,
    };
  }
};

const AuthPayload = getAuthPayload();
export default AuthPayload;
