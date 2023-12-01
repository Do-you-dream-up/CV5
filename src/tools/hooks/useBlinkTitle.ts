import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useTabNotification(interval = 1000) {
  let pageTitle = document.title;
  const { t } = useTranslation('translation');
  const livechatNotification = t('livechat.notif.newMessage');
  const [flashingNotificationActivated, setFlashingNotificationActivated] = useState(false);
  const notificationIntervalId = useRef<any>();

  function setTabNotification() {
    setFlashingNotificationActivated(true);
  }

  function clearTabNotification() {
    setFlashingNotificationActivated(false);
    changeOrKeepTitlePage();
    stopNotifying();
  }

  function changeOrKeepTitlePage() {
    if (document.title !== pageTitle) {
      if (document.title !== '' && document.title != livechatNotification) {
        pageTitle = document.title;
      } else {
        document.title = pageTitle;
      }
    }
    return pageTitle;
  }

  useEffect(() => {
    if (!notificationIntervalId.current && flashingNotificationActivated) startNotifying();
  }, [flashingNotificationActivated]);

  function startNotifying() {
    notificationIntervalId.current = setInterval(() => displayAlternativelyPageTitleAndNotification(), interval);
  }

  function displayAlternativelyPageTitleAndNotification() {
    if (document.title === livechatNotification) {
      document.title = pageTitle;
    } else {
      document.title = livechatNotification;
    }
    return document.title;
  }

  function stopNotifying() {
    clearInterval(notificationIntervalId.current);
    notificationIntervalId.current = null;
  }

  return {
    pageTitle,
    changeOrKeepTitlePage,
    setTabNotification,
    clearTabNotification,
    notificationIntervalId,
    displayAlternativelyPageTitleAndNotification,
  };
}

export default useTabNotification;
