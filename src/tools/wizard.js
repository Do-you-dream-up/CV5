import qs from 'qs';

export const hasWizard = () => qs.parse(window.location.search, { ignoreQueryPrefix: true }).dydupanel !== undefined;

export const isInIframe = () => window.self !== window.top;

export const isLoadedFromChannels = () => window?.dyduReferer;
