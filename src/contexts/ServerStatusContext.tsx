import { createContext, useCallback, useContext, useState } from 'react';

import { emit, SERVLET_API } from '../tools/axios';

export interface ServerStatusProviderProps {
  children?: any;
}

export interface ServerStatusContextProps {
  fetch: () => Promise<any>;
  checked: boolean;
}

export const useServerStatus = () => useContext<ServerStatusContextProps>(ServerStatusContext);

export const ServerStatusContext = createContext({} as ServerStatusContextProps);

export const ServerStatusProvider = ({ children }: ServerStatusProviderProps) => {
  const [checked, setChecked] = useState(false);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      if (SERVLET_API) {
        const path = `/serverstatus`;
        return emit(SERVLET_API.get, path, null, 5000)
          .then(() => {
            return resolve({ status: 'OK' });
          })
          .finally(() => {
            setChecked(true);
          });
      }
    });
  }, [SERVLET_API]);

  const value: ServerStatusContextProps = {
    fetch,
    checked,
  };

  return <ServerStatusContext.Provider value={value}>{children}</ServerStatusContext.Provider>;
};
