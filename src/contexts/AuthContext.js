import { createAuthContext } from '@dydu_ai/oidc';
import configuration from '../../public/override/configuration.json';

const { AuthContext, Authenticated, useToken } = createAuthContext({
  authorizeEndpoint: `${process.env.OIDC_URL}/authorize`,
  clientId: process.env.OIDC_CLIENT_ID,
  provider: process.env.OIDC_URL,
  scopes: configuration.oidc.scopes,
  tokenEndpoint: `${process.env.OIDC_URL}/token`,
});

export { AuthContext, Authenticated, useToken };
