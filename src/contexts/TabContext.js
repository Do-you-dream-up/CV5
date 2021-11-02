import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from './ConfigurationContext';

export const TabContext = React.createContext();
export function TabProvider({ children }) {
  const { configuration } = useContext(ConfigurationContext);
  const { hasContactTab, items, selected = 0 } = configuration.tabs;
  const [current, setCurrent] = useState();
  const [tabs, setTabs] = useState();

  const find = useCallback(
    (value) =>
      tabs &&
      tabs.findIndex((it, index) => value === it.key || value === index),
    [tabs],
  );

  const select = useCallback((value) => () => setCurrent(find(value)), [find]);

  const should = (value) => find(value) === current;

  useEffect(() => {
    if (hasContactTab) {
      setTabs(items);
    } else {
      setTabs(items.filter((item) => item.key === 'dialog'));
    }
  }, [hasContactTab, items]);

  useEffect(() => {
    if (Array.isArray(tabs)) {
      select(selected)();
    }
  }, [select, selected, tabs]);

  return (
    <TabContext.Provider
      children={children}
      value={{
        current,
        select,
        should,
        tabs,
      }}
    />
  );
}

TabProvider.propTypes = {
  children: PropTypes.object,
};
