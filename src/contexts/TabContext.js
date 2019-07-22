import PropTypes from 'prop-types';
import React from 'react';
import Configuration from '../tools/configuration';


const TABS = Configuration.get('tabs');
const TABS_SELECTED = TABS.selected || 0;
const TABS_VALUES = Array.isArray(TABS.values) ? TABS.values : [TABS.values];
const TABS_POSSIBLE_VALUES = TABS_VALUES.map(it => it.value);


export const TabContext = React.createContext();
export class TabProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  state = {current: (TABS_VALUES[TABS_SELECTED] || {}).value};

  select = value => () => {
    if (TABS_POSSIBLE_VALUES) {
      this.setState({current: value});
    }
  };

  render() {
    return <TabContext.Provider children={this.props.children} value={{
      select: this.select,
      state: this.state,
    }} />;
  }
}
