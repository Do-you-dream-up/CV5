import qs from 'qs';

export const hasWizard = () => qs.parse(window.location.search, { ignoreQueryPrefix: true }).dydupanel !== undefined;

export function isLoadedFromChannels() {
  return 'preview' === window.frameElement?.name;
}
