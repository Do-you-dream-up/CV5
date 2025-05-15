import { isLoadedFromChannels } from './wizard';

import { Local } from './storage';
import { getResourceWithoutCache } from './resources';
import dydu from './dydu';
import { DEFAULT_CONSULTATION_SPACE } from './constants';

/**
 * Helper class to find values in a JSON configuration file.
 */
export const configuration = new (class Configuration {
  constructor() {
    this.configuration = {};
  }

  getConfigFromStorage = () => Local.get(Local.names.wizard);
  getImagesFromStorage = () => Local.get(Local.names.images);

  /**
   * Fetch the configuration JSON and save its content.
   *
   * @param {string} [path] - Configuration file path.
   * @returns {Promise}
   */
  initialize = async () => {
    return getResourceWithoutCache('override/configuration.json').then(({ data }) => {
      this.configuration = null;

      if (isLoadedFromChannels() && this.getConfigFromStorage()) {
        this.configuration = JSON.parse(JSON.stringify(this.getConfigFromStorage()));

        // Replace images with base64 ones
        const images = JSON.parse(JSON.stringify(this.getImagesFromStorage()));
        this.configuration.avatar.response.image = images?.logo;
        this.configuration.avatar.teaser.image = images?.teaser;
        this.configuration.header.logo.imageLink.understood = images?.understood;
        this.configuration.header.logo.imageLink.misunderstood = images?.misunderstood;
        this.configuration.header.logo.imageLink.livechat = images?.livechat;
        this.configuration.header.logo.imageLink.reword = images?.reword;
        this.configuration.onboarding.items[0].image.src = images?.onboarding1;
        this.configuration.onboarding.items[1].image.src = images?.onboarding2;
        this.configuration.onboarding.items[2].image.src = images?.onboarding3;
      } else {
        this.configuration = data;
      }

      if (!isLoadedFromChannels()) {
        const currentSpace = Local.space.load();
        if (currentSpace === null || currentSpace === DEFAULT_CONSULTATION_SPACE) {
          dydu.setSpace(this.configuration?.spaces?.items[0]);
        }
      }

      dydu.setConfiguration(this.configuration);
      return this.configuration;
    });
  };
})();
