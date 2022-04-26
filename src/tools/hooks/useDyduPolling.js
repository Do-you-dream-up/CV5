import { TUNNEL_MODE } from '../../contexts/LivechatContext';
import StartPolling from '../special-actions/Polling/StartPolling';
import { useCallback, useEffect } from 'react';
import { useDialog } from '../../contexts/DialogContext';

export default function useDyduPolling() {
  const { setStatusText } = useDialog();

  useEffect(() => {
    return () => {
      StartPolling.options.displayResponse = window.chat.reply;
      StartPolling.options.displayStatus = setStatusText;
    };
  }, [setStatusText]);

  const open = useCallback((configuration) => {
    return new Promise((resolve) => {
      StartPolling(configuration.api, configuration);
      resolve(true);
    });
  }, []);

  return {
    isAvailable: () => true,
    mode: TUNNEL_MODE.polling,
    open,
  };
}
