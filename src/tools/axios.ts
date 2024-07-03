import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { hasProperty, isDefined, isPositiveNumber, secondsToMs } from './helpers';
import { BOT, initBotInfoFromJsonOrChannels } from './bot';
import { getOidcEnableWithAuthStatus } from './oidc';
import Storage from '../components/auth/Storage';
import { decode } from './cipher';
import debounce from 'debounce-promise';
import dydu from './dydu';
import { Local } from './storage';

interface AxiosDyduConfig {
  server: string;
  timeout: number;
  axiosConf: any;
}

const sessionCurrentServerIndex = sessionStorage.getItem('dydu.server');
let currentServerIndex: number = sessionCurrentServerIndex ? Number.parseInt(sessionCurrentServerIndex) : 0;
let lastStatus = 'OK';
const minTimeoutForAnswer: number = secondsToMs(3);
let triesCounter = 0;
const maxTries = 3;

let configuration: any = null;
let lastResponse: any = null;

let callTokenRefresher: any = null;
let callOidcLogin: any = null;

const getAxiosInstanceWithDyduConfig = (config: AxiosDyduConfig) => {
  if (!isDefined(config?.axiosConf)) config.axiosConf = {};

  const instance = axios.create({
    baseURL: config?.server,
    timeout: isPositiveNumber(config?.timeout) ? config.timeout : axios.defaults.timeout,
    ...config.axiosConf,
  });

  // when request is sent
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (getOidcEnableWithAuthStatus()) {
        const tokenInfo = Storage.loadToken();
        const idToken: string | null | undefined = isDefined(tokenInfo?.id_token) ? tokenInfo.id_token : undefined;
        const accessToken: string | null | undefined = isDefined(tokenInfo?.access_token)
          ? tokenInfo.access_token
          : undefined;

        if (!config.headers) {
          config.headers = {};
        }

        if (idToken) {
          config.headers['Authorization'] = `Bearer ${idToken}`;
        }

        if (accessToken) {
          config.headers['OIDCAccessToken'] = `${accessToken}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // when response code in range of 2xx
  const onSuccess = (response: any) => {
    return response;
  };

  instance.interceptors.response.use(onSuccess);

  return instance;
};

const handleSwitchToBackup = (currentServerPreviouslyUsed?: number) => {
  if (lastStatus === 'Error') {
    const backupServer: string | null = BOT.getNextServer(currentServerIndex, currentServerPreviouslyUsed);
    console.log('Status error, switching to server=' + backupServer);

    if (backupServer) {
      currentServerIndex++;
      if (currentServerIndex >= BOT.servers.length) {
        currentServerIndex = 0;
        triesCounter++;
        console.log('TriesCounter=' + triesCounter + ', waiting 5000ms');
        (async () => wait(5000))();
      }
      SERVLET_API.defaults.baseURL = buildServletApiUrl(backupServer);
      SERVLET.defaults.baseURL = buildServletUrl(backupServer);
    } else {
      triesCounter++;
      (async () => wait(5000))();
    }
  }
};

const wait = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const handleSetApiTimeout = (ms: number) => {
  let timeout = minTimeoutForAnswer;
  if (ms) {
    timeout = ms;
  }

  if (SERVLET_API?.defaults) {
    SERVLET_API.defaults.timeout = timeout;
  }

  if (SERVLET?.defaults) {
    SERVLET.defaults.timeout = timeout;
  }
};

const handleAxiosResponse = (data: any) => {
  if (!data) {
    data = {};
  }

  data && configuration?.saml?.enable && samlRenewOrReject(data);

  if (hasProperty(data, 'values')) {
    data.values = decode(data.values);
    if (data.values.contextId) {
      dydu.setContextId(data.values.contextId);
    }
    return data.values;
  }

  return data;
};

const samlRenewOrReject = ({ type, values }) => {
  switch (type) {
    case 'SAML_redirection':
      redirectAndRenewAuth(values);
      break;
    default:
      return renewAuth(values?.auth);
  }
};

const redirectAndRenewAuth = (values: any) => {
  const relayState = encodeURI(window.location.href);
  // const relayState = JSON.stringify({ redirection: encodeURI(window.location.href), bot: BOT.id });
  try {
    renewAuth(atob(values?.auth));
    window.location.href = `${atob(values?.redirection_url)}&RelayState=${relayState}`;
  } catch {
    renewAuth(values?.auth);
    window.location.href = `${values?.redirection_url}&RelayState=${relayState}`;
  }
};

const renewAuth = (auth: string) => {
  if (auth) {
    try {
      Local.saml.save(atob(auth));
    } catch {
      Local.saml.save(auth);
    }
  }
};

const handleAxiosError = (
  error: any,
  verb: any,
  path: string,
  data: any,
  timeout: number,
  currentServerIndexForThisRequest: number,
) => {
  if (triesCounter >= maxTries) {
    throw 'API Unreachable';
  }

  /**
   * NO 401 ERROR
   */
  if (error?.response?.status !== 401) {
    lastStatus = 'Error';
  }

  /**
   * IF 401
   */
  if (getOidcEnableWithAuthStatus()) {
    return new Promise((resolve) =>
      handleTokenRefresh(() => {
        setTimeout(() => {
          return resolve(emit(verb, path, data, timeout, currentServerIndexForThisRequest));
        }, minTimeoutForAnswer);
      }),
    );
  }

  // Retry API Call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(emit(verb, path, data, timeout, currentServerIndexForThisRequest));
    }, minTimeoutForAnswer);
  });
};

const handleTokenRefresh = (retry: any) => {
  if (configuration?.oidc?.enable) {
    const tokenInfo = Storage.loadToken();
    const refreshToken = isDefined(tokenInfo?.refresh_token) ? tokenInfo.refresh_token : undefined;

    if (refreshToken && refreshToken?.length > 0 && triesCounter < 2 && Storage.loadPkceCodeVerifier()) {
      console.log('Refreshing token...');
      callTokenRefresher().then(() => {
        return retry();
      });
    } else {
      console.log('No refresh token found, redirecting to login page...');
      Storage.clearToken();
      callOidcLogin();
      return Promise.resolve();
    }
  }
};

const formatConsoleError = (error: any) => {
  console.group('An error occurred while sending the request to Dydu. Please send us this group of logs :');
  console.log('Date : ', new Date());
  console.log('Error : ', error.message);
  console.log('Status : ', error.status || error?.response?.status);
  console.log('Request : [%s] %s%s', error.config.method.toUpperCase(), error.config.baseURL, error.config.url);
  console.log('Headers :', JSON.stringify(error.config.headers));
  console.log(
    'Data :\n%s',
    error.config.data
      ? error.config.data
          .trim()
          .split('&')
          .map((s: string) => decodeURIComponent(s))
          .join('\n')
      : 'no data',
  );
  console.groupEnd();
};

/**
 * Request against the provided path with the specified data. When
 * the response contains values, decode it and refresh the context ID.
 * if the request fail several times the request will be failover to back-up server.
 *
 * @param {function} verb - A verb method to request with.
 * @param {string} path - Path to send the request to.
 * @param {Object} data - Data to send.
 * @param {number} timeout - timeout value to use.
 * @param {boolean} ignoreSwitch - set tu true, the server switch will not occur.
 * @param {number} currentServerPreviouslyUsed - server index used with the last request. Used to switch server
 * @returns {Promise}
 */
const emit = debounce(
  (verb: any, path: string, data: any, timeout: number, currentServerPreviouslyUsed?: number) => {
    handleSwitchToBackup(currentServerPreviouslyUsed);
    handleSetApiTimeout(timeout);

    const pathWithoutTrailingSlash = path.replace(/\/$/, '');

    const currentServerIndexForThisRequest = currentServerIndex;

    try {
      return verb(pathWithoutTrailingSlash, data)
        .then((response: any) => {
          lastResponse = response;
          lastStatus = 'OK';
          triesCounter = 0;
          sessionStorage.setItem('dydu.server', currentServerIndex.toString());
          return response;
        })
        .then(({ data = {} }) => {
          return handleAxiosResponse(data);
        })
        .catch((error: any) => {
          formatConsoleError(error);
          return handleAxiosError(
            error,
            verb,
            pathWithoutTrailingSlash,
            data,
            timeout,
            currentServerIndexForThisRequest,
          );
        });
    } catch (e) {
      console.error('while executing |emit()|', e);
    }
  },
  100,
  { leading: true },
);

const getServerFromIndex = (index: number): string | null => {
  return BOT !== null ? BOT.getServer(index) : null;
};

const isLocalServer = (server: string | null): boolean => {
  return (
    server !== null &&
    (server.includes('dev.dydu.local') || server.includes('localhost') || server.endsWith('.loca.lt'))
  );
};

const buildServletUrl = (server?: string | null): string => {
  if (!server) {
    server = getServerFromIndex(currentServerIndex);
  }

  const servletPath = isLocalServer(server) ? '' : 'servlet/';
  return `${server}/${servletPath}`;
};

const buildServletApiUrl = (server?: string | null): string => {
  return buildServletUrl(server) + 'api/';
};

let SERVLET_API: AxiosInstance, SERVLET: AxiosInstance;

initBotInfoFromJsonOrChannels().then(() => {
  SERVLET_API = getAxiosInstanceWithDyduConfig({
    server: buildServletApiUrl(),
    timeout: minTimeoutForAnswer,
    axiosConf: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    },
  });

  /**
   * Used for old Servlet API
   */
  SERVLET = getAxiosInstanceWithDyduConfig({
    server: buildServletUrl(),
    timeout: minTimeoutForAnswer,
    axiosConf: {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Content-Type': 'multipart/form-data',
      },
    },
  });
});

const getLastResponse = (): any => lastResponse;
const setLastResponse = (newLastResponse: any) => (lastResponse = newLastResponse);

const setConfiguration = (newConfiguration: any) => (configuration = newConfiguration);

const setCallTokenRefresher = (newCallTokenRefresher: any) => {
  callTokenRefresher = newCallTokenRefresher;
};

const setCallOidcLogin = (newCallOidcLogin: any) => {
  callOidcLogin = newCallOidcLogin;
};

const emitLivechatError = () => {
  currentServerIndex++;
};

export {
  getLastResponse,
  setLastResponse,
  setConfiguration,
  setCallTokenRefresher,
  setCallOidcLogin,
  getAxiosInstanceWithDyduConfig,
  emit,
  emitLivechatError,
  buildServletUrl,
  SERVLET_API,
  SERVLET,
  currentServerIndex,
};
