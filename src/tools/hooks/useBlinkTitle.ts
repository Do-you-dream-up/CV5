import { useEffect, useRef, useState } from 'react';

const originalTitle = document.title;

function revertOriginalTitle() {
  document.title = originalTitle;
}

function tick(message) {
  document.title = document.title === message ? originalTitle : message;
}

function useTabNotification(interval = 1000) {
  const [message, setMessage] = useState(null);
  const notificationIntervalId = useRef<any>();

  function setTabNotification(message) {
    setMessage(message);
  }

  function clearTabNotification() {
    revertOriginalTitle();
    setMessage(null);
  }

  function startNotifying() {
    notificationIntervalId.current = setInterval(tick, interval, message);
  }

  function stopNotifying() {
    clearInterval(notificationIntervalId.current);
    notificationIntervalId.current = null;
  }

  useEffect(() => {
    if (notificationIntervalId.current && !message) stopNotifying();

    if (!notificationIntervalId.current && message) startNotifying();
  }, [message]);

  useEffect(() => {
    return () => {
      if (document.title !== originalTitle) revertOriginalTitle();

      if (notificationIntervalId.current) clearInterval(notificationIntervalId.current);
    };
  }, []);

  return { setTabNotification, clearTabNotification };
}

export default useTabNotification;
