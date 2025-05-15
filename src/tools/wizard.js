export function isLoadedFromChannels() {
  return 'preview' === window.frameElement?.name;
}
