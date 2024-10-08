import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Local } from '../storage';

export function useTabNotification(interval = 1000) {
  const pageTitleRef = useRef(document.title);
  const { t } = useTranslation('translation');
  const [livechatNotification, setLivechatNotification] = useState<string>(t('livechat.notif.newMessage'));
  const [flashingNotificationActivated, setFlashingNotificationActivated] = useState(false);
  const notificationIntervalId = useRef<any>();
  const notificationPattern = /\d+ nouveau(x)? message(s)?/;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTitle = document.title;

      if (!notificationPattern.test(newTitle)) {
        pageTitleRef.current = newTitle;
      }
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { childList: true });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    stopNotifying();
    startNotifying();
  }, [livechatNotification]);

  function setTabNotification() {
    setFlashingNotificationActivated(true);
  }

  function clearTabNotification() {
    setFlashingNotificationActivated(false);
    changeOrKeepTitlePage();
    stopNotifying();
  }

  function changeOrKeepTitlePage() {
    if (document.title !== '' && !document.title.match(notificationPattern)) {
      pageTitleRef.current = document.title;
    } else {
      document.title = pageTitleRef.current;
    }
    return pageTitleRef.current;
  }

  useEffect(() => {
    if (!notificationIntervalId.current && flashingNotificationActivated) {
      startNotifying();
    }
  }, [flashingNotificationActivated]);

  function startNotifying() {
    notificationIntervalId.current = setInterval(() => displayAlternativelyPageTitleAndNotification(), interval);
  }

  function displayAlternativelyPageTitleAndNotification() {
    if (Local.isLivechatOn.load()) {
      if (document.title === livechatNotification) {
        document.title = pageTitleRef.current;
      } else {
        document.title = livechatNotification;
      }
    }
    return document.title;
  }

  function stopNotifying() {
    clearInterval(notificationIntervalId.current);
    notificationIntervalId.current = null;
  }

  return {
    pageTitle: pageTitleRef.current,
    changeOrKeepTitlePage,
    setTabNotification,
    clearTabNotification,
    notificationIntervalId,
    displayAlternativelyPageTitleAndNotification,
    setLivechatNotification,
  };
}

export default useTabNotification;
