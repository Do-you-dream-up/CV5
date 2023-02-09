import { hasWizard, isLoadedFromChannels } from './wizard';

import { ConfigurationContext } from '../contexts/ConfigurationContext';
import { Local } from './storage';
import { PureComponent } from 'react';
import axios from 'axios';
import { axiosConfigNoCache } from './axios';
import dydu from './dydu';
import json from './configuration.json';

/**
 * Helper class to find values in a JSON configuration file.
 */
export const configuration = new (class Configuration {
  constructor() {
    this.configuration = {};
  }

  getConfigFromStorage = () => Local.get(Local.names.wizard);

  /**
   * Fetch the configuration JSON and save its content.
   *
   * @param {string} [path] - Configuration file path.
   * @returns {Promise}
   */
  initialize = (path = `${process.env.PUBLIC_URL}override/configuration.json`) => {
    this.configuration = JSON.parse(JSON.stringify(json));
    return axios.get(path, axiosConfigNoCache).then(({ data }) => {
      this.configuration =
        (isLoadedFromChannels() || hasWizard()) && this.getConfigFromStorage()
          ? JSON.parse(JSON.stringify(this.getConfigFromStorage()))
          : data;

      if (!isLoadedFromChannels()) {
        if (Local.get(Local.names.space) === 'default' || Local.get(Local.names.space) === null) {
          dydu.setSpace(configuration?.spaces?.items[0]);
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
