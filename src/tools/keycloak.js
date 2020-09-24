import Keycloak from 'keycloak-js';

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback, configuration) => {
  const _kc = new Keycloak({
    'clientId': configuration.clientId,
    'realm': configuration.realm,
    'url': configuration.url
  });
  _kc.init({
    onLoad: 'login-required'
  }).then((authenticated) => {
      if (authenticated) {
        onAuthenticatedCallback();
      }
      else {
        _kc.login;
      }
    });
};

export default {
  initKeycloak,
};
