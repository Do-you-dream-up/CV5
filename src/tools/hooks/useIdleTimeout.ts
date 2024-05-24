import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const useIdleTimeout = ({ onIdle, idleTimeout = 1, disabled }) => {
  const [isIdle, setIdle] = useState(false);

  const handleIdle = () => {
    setIdle(true);
  };

  const idleTimer = useIdleTimer({
    timeout: idleTimeout,
    promptBeforeIdle: idleTimeout / 2,
    onPrompt: onIdle,
    onIdle: handleIdle,
    debounce: 500,
    disabled: disabled,
  });
  return {
    isIdle,
    setIdle,
    idleTimer,
  };
};
export default useIdleTimeout;
