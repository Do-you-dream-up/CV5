import {createAuthContext} from '@dydu_ai/oidc';
import configuration from '../../public/override/configuration.json';

const { AuthContext, Authenticated, useToken } = createAuthContext({
  clientId: configuration.oidc.clientId,
  provider: process.env.OIDC_URL,
  scopes: configuration.oidc.scopes,
});

export { AuthContext, Authenticated, useToken };
