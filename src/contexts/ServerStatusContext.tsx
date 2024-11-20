import { createContext, useCallback, useContext, useState } from 'react';

import { emit, SERVLET_API } from '../tools/axios';

export interface ServerStatusProviderProps {
  children?: any;
}

export interface ServerStatusContextProps {
  checkServerStatus: () => void;
  isServerAvailable: boolean;
}

export const useServerStatus = () => useContext<ServerStatusContextProps>(ServerStatusContext);

export const ServerStatusContext = createContext({} as ServerStatusContextProps);

export const ServerStatusProvider = ({ children }: ServerStatusProviderProps) => {
  const [isServerAvailable, setIsServerAvailable] = useState(false);

  const checkServerStatus = () => {
    if (SERVLET_API) {
      const path = `/serverstatus`;
      emit(SERVLET_API.get, path, null, 5000)
        .then(() => {
          setIsServerAvailable(true);
        })
        .catch(() => setIsServerAvailable(false));
    }
  };

  const value: ServerStatusContextProps = {
    checkServerStatus,
    isServerAvailable,
  };

  return <ServerStatusContext.Provider value={value}>{children}</ServerStatusContext.Provider>;
};
