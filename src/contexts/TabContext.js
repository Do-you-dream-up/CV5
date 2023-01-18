import { createContext, useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useConfiguration } from './ConfigurationContext';

export const TabContext = createContext();
export function TabProvider({ children }) {
  const { configuration } = useConfiguration();
  const { hasContactTab, items, selected = 0 } = configuration.tabs;
  const [current, setCurrent] = useState();
  const [tabs, setTabs] = useState();

  const find = useCallback(
    (value) => tabs && tabs.findIndex((it, index) => value === it.key || value === index),
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
  children: PropTypes.array,
};
