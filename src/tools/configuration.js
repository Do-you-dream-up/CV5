import { hasWizard, isLoadedFromChannels } from './wizard';

import { ConfigurationContext } from '../contexts/ConfigurationContext';
import { Local } from './storage';
// import { Local } from './storage';
import React from 'react';
import axios from 'axios';
import { axiosConfigNoCache } from './axios';
import json from './configuration.json';

/**
 * Helper class to find values in a JSON configuration file.
 */
export const configuration = new (class Configuration {
  constructor() {
    this.configuration = {};
  }

  /**
   * Fetch the configuration JSON and save its content.
   *
   * @param {string} [path] - Configuration file path.
   * @returns {Promise}
   */
  initialize = (path = `${process.env.PUBLIC_URL}override/configuration.json`) => {
    this.configuration = JSON.parse(JSON.stringify(json));
    return axios.get(path, axiosConfigNoCache).then(({ data }) => {
      const fromStorage = Local.get(Local.names.wizard);
      console.log(
        '🚀 ~ file: configuration.js ~ line 31 ~ Configuration ~ returnaxios.get ~ isLoadedFromChannels()',
        isLoadedFromChannels(),
      );
      this.configuration =
        (isLoadedFromChannels() || hasWizard()) && fromStorage ? JSON.parse(JSON.stringify(fromStorage)) : data;
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
  class InnerComponent extends React.PureComponent {
    static contextType = ConfigurationContext;
    render() {
      return <Component configuration={this.context.configuration} {...this.props} />;
    }
  };
