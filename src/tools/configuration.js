import axios from 'axios';
import React from 'react';
import { ConfigurationContext } from '../contexts/ConfigurationContext';
import json from './configuration.json';
import { Local } from './storage';


/**
 * Helper class to find values in a JSON configuration file.
 */
export const configuration = new class Configuration {

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

    return axios.get(path).then(
      ({ data }) => {
        if (Local.get(Local.names.wizard)) {
          this.configuration = Local.get(Local.names.wizard);
          return this.sanitize(JSON.parse(JSON.stringify(this.configuration)));
        }
        else {
          return this.sanitize(JSON.parse(JSON.stringify(data)));
        }
      }
    );
  };

  /**
   * Clean up and ensure sane style values. This typically will convert styles
   * into values JSS can understand.
   *
   * @param {Object} data - Configuration object to sanitize.
   * @returns {Object}
   */
  sanitize = data => {
    const forgeStyles = ({
      background,
      bottom,
      height,
      left,
      maxHeight,
      position,
      right,
      top,
      width,
    } = {}) => ({
      ...(background !== undefined && {background}),
      ...(bottom !== undefined && {bottom}),
      ...(height !== undefined && {height}),
      ...(left !== undefined && {left}),
      ...(maxHeight !== undefined && {maxHeight}),
      ...(position !== undefined && {position}),
      ...(right !== undefined && {right}),
      ...(top !== undefined && {top}),
      ...(width !== undefined && {width}),
    });
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Object) {
        data[key] = {
          ...data[key],
          ...(data[key].styles && {styles: forgeStyles(data[key].styles)}),
          ...(data[key].stylesMobile && {stylesMobile: forgeStyles(data[key].stylesMobile)}),
        };
      }
    });
    return data;
  };
}();


/**
 * High-order component to pass on configuration.
 */
export const withConfiguration = Component => class InnerComponent extends React.PureComponent {
  static contextType = ConfigurationContext;
  render() {
    return <Component configuration={this.context.configuration} {...this.props} />;
  }
};
