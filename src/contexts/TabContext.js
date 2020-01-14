import PropTypes from 'prop-types';
import React from 'react';
import { withConfiguration } from '../tools/configuration';


export const TabContext = React.createContext();
export const TabProvider = withConfiguration(class TabProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    configuration: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { items, selected = 0 } = props.configuration.tabs;
    this.state = {current: items[selected]};
  }


  select = value => () => {
    this.setState({current: value});
  };

  should = value => value === this.state.current;

  render() {
    return <TabContext.Provider children={this.props.children} value={{
      select: this.select,
      should: this.should,
      state: this.state,
    }} />;
  }
});
