import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import dydu from '../tools/dydu';

export interface ServerStatusProviderProps {
  children?: any;
}

export interface ServerStatusContextProps {
  fetch: any;
  result: any;
  checked: boolean;
}

export const useServerStatus = () => useContext<ServerStatusContextProps>(ServerStatusContext);

export const ServerStatusContext = createContext({} as ServerStatusContextProps);

export const ServerStatusProvider = ({ children }: ServerStatusProviderProps) => {
  const [result, setResult] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    dydu.setServerStatusCheck(fetch);
  }, []);

  useEffect(() => {
    result && dydu.setMainServerStatus(result.status);
  }, [result]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu
        .getServerStatus()
        .then((res) => {
          setResult(res);
          return resolve(res);
        })
        .finally(() => {
          setChecked(true);
        });
    });
  }, []);

  const value: ServerStatusContextProps = {
    fetch,
    result,
    checked,
  };

  return <ServerStatusContext.Provider value={value}>{children}</ServerStatusContext.Provider>;
};
