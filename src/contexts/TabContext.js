import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from './ConfigurationContext';


export const TabContext = React.createContext();
export function TabProvider({ children }) {

  const { configuration } = useContext(ConfigurationContext);
  const { items, selected = 0 } = configuration.tabs;
  const [ current, setCurrent ] = useState();
  const [ tabs, setTabs ] = useState();

  const find = value => tabs.findIndex((it, index) => value === it.key || value === index);

  const select = value => () => setCurrent(find(value));

  const should = value => find(value) === current;

  useEffect(() => {
    if (Array.isArray(items)) {
      setTabs(items.filter(it => it.key));
    }
  }, [items]);

  useEffect(() => {
    if (Array.isArray(tabs)) {
      select(selected)();
    }
  }, [tabs]);

  return <TabContext.Provider children={children} value={{
    current,
    select,
    should,
    tabs,
  }} />;
}


TabProvider.propTypes = {
  children: PropTypes.object,
};
