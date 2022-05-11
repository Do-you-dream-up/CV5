import { TUNNEL_MODE } from '../../contexts/LivechatContext';
import StartPolling from '../special-actions/Polling/StartPolling';
import { useCallback } from 'react';

export default function useDyduPolling() {
  const setupOutputs = useCallback((configuration) => {
    StartPolling.options.displayResponse = configuration.displayResponseText;
    StartPolling.options.displayStatus = configuration.displayNotification;
  }, []);

  const open = useCallback(
    (configuration) => {
      return new Promise((resolve) => {
        setupOutputs(configuration);
        StartPolling(configuration.api, configuration);
        resolve(true);
      });
    },
    [setupOutputs],
  );

  return {
    isAvailable: () => true,
    mode: TUNNEL_MODE.polling,
    open,
  };
}
