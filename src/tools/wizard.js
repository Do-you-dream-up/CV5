import qs from 'qs';

export const hasWizard = () => qs.parse(window.location.search, { ignoreQueryPrefix: true }).dydupanel !== undefined;

export const isLoadedFromChannels = () => window?.dyduReferer;
