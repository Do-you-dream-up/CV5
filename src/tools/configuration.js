import { hasWizard, isLoadedFromChannels } from './wizard';

import { ConfigurationContext } from '../contexts/ConfigurationContext';
import { Local } from './storage';
import { PureComponent } from 'react';
import { getResourceWithoutCache } from './resources';
import dydu from './dydu';

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

      if ((isLoadedFromChannels() || hasWizard()) && this.getConfigFromStorage()) {
        this.configuration = JSON.parse(JSON.stringify(this.getConfigFromStorage()));

        if (isLoadedFromChannels()) {
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
        }
      } else {
        this.configuration = data;
      }

      if (!isLoadedFromChannels()) {
        if (Local.get(Local.names.space) === 'default' || Local.get(Local.names.space) === null) {
          dydu.setSpace(this.configuration?.spaces?.items[0]);
        }
      }

      dydu.setConfiguration(this.configuration);
      return this.configuration;
    });
  };

  /**
   * Clean up and ensure sane style values. This typically will convert styles
   * into values JSS can understand.
   *
   * @param {Object} data - Configuration object to sanitize.
   * @returns {Object}
   */
  sanitize = (data) => {
    const forgeStyles = ({ background, bottom, height, left, maxHeight, position, right, top, width } = {}) => ({
      ...(background !== undefined && { background }),
      ...(bottom !== undefined && { bottom }),
      ...(height !== undefined && { height }),
      ...(left !== undefined && { left }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(position !== undefined && { position }),
      ...(right !== undefined && { right }),
      ...(top !== undefined && { top }),
      ...(width !== undefined && { width }),
    });
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Object) {
        data[key] = {
          ...data[key],
          ...(data[key].styles && { styles: forgeStyles(data[key].styles) }),
          ...(data[key].stylesMobile && {
            stylesMobile: forgeStyles(data[key].stylesMobile),
          }),
        };
      }
    });
    return data;
  };
})();

/**
 * High-order component to pass on configuration.
 */
export const withConfiguration = (Component) =>
  class InnerComponent extends PureComponent {
    static contextType = ConfigurationContext;
    render() {
      return <Component configuration={this.context.configuration} {...this.props} />;
    }
  };
