import { createContext, useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useConfiguration } from './ConfigurationContext';
import { ContactIcon, ConversationIcon } from '../components/CustomIcons/CustomIcons';

const ITEM_KEY = {
  dialog: 'dialog',
  contacts: 'contacts',
};

const ITEM_KEY_TO_ICON_NAME = {
  [ITEM_KEY.dialog]: <ConversationIcon />,
  [ITEM_KEY.contacts]: <ContactIcon />,
};

export const TabContext = createContext();
export function TabProvider({ children }) {
  const { configuration } = useConfiguration();
  let { hasContactTab, items, selected = 0 } = configuration.tabs;
  const [current, setCurrent] = useState();
  const [tabs, setTabs] = useState();

  const find = useCallback(
    (value) => tabs && tabs.findIndex((it, index) => value === it.key || value === index),
    [tabs],
  );

  const select = useCallback((value) => () => setCurrent(find(value)), [find]);

  const should = (value) => find(value) === current;

  useEffect(() => {
    items = items.map((it) => ({ ...it, icon: ITEM_KEY_TO_ICON_NAME[it?.key] || '' }));
    if (hasContactTab) {
      setTabs(items);
    } else {
      setTabs(items.filter((item) => item?.key === ITEM_KEY.dialog));
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
