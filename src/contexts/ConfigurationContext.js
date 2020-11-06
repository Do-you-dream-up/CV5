import PropTypes from 'prop-types';
import React from 'react';


export const ConfigurationContext = React.createContext();
export class ConfigurationProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    configuration: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {configuration: props.configuration};
  }

  reset = configuration => new Promise((resolve) => this.setState(state => ({
    configuration: {...state.configuration, ...configuration}
  }), () => resolve(this.state.configuration)));

  update = (parent, key, value) => new Promise(resolve => this.setState(state => ({
    configuration: {
      ...state.configuration,
      [parent]: {
        ...state.configuration[parent],
        [key]: value,
      },
    },
  }), () => resolve(this.state.configuration)));

  render() {
    return <ConfigurationContext.Provider children={this.props.children} value={{
      configuration: this.state.configuration,
      reset: this.reset,
      update: this.update,
    }} />;
  }
}
