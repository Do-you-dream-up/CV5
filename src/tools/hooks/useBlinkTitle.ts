import { useEffect, useRef, useState } from 'react';

export const originalTitle = document.title;

function revertOriginalTitle() {
  document.title = originalTitle;
}

export function tick(message) {
  document.title = document.title === message ? originalTitle : message;
}

function useTabNotification(interval = 1000) {
  const [message, setMessage] = useState(null);
  const notificationIntervalId = useRef<any>();

  function setTabNotification(message) {
    setMessage(message);
    tick(message);
  }

  function clearTabNotification() {
    setMessage(null);
    revertOriginalTitle();
    stopNotifying();
  }

  function startNotifying() {
    notificationIntervalId.current = setInterval(() => tick(message), interval);
  }

  function stopNotifying() {
    clearInterval(notificationIntervalId.current);
    notificationIntervalId.current = null;
  }

  useEffect(() => {
    if (!notificationIntervalId.current && message) startNotifying();
  }, [message]);

  useEffect(() => {
    return () => {
      if (document.title !== originalTitle) revertOriginalTitle();

      if (notificationIntervalId.current) clearInterval(notificationIntervalId.current);
    };
  }, []);

  return { setTabNotification, clearTabNotification, notificationIntervalId };
}

export default useTabNotification;
