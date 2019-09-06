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

  update = (parent, key, value) => {
    try {
      value = JSON.parse(value);
    }
    catch {}
    this.setState(state => ({
      configuration: {
        ...state.configuration,
        [parent]: {
          ...state.configuration[parent],
          [key]: value,
        },
      },
    }));
  };

  render() {
    return <ConfigurationContext.Provider children={this.props.children} value={{
      state: this.state,
      update: this.update,
    }} />;
  }
}
