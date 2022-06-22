import { useEffect, useMemo } from 'react';
import { isDefined, asset } from '../helpers';
import { INTERACTION_NOTIFICATION_TYPE } from '../constants';
import LivechatPayload from '../LivechatPayload';

const isTimeout = (notification) =>
  LivechatPayload.is.timeout(notification) ? INTERACTION_NOTIFICATION_TYPE.timeout : null;

const isEndLivechat = (notification) =>
  LivechatPayload.is.endPolling(notification) ? INTERACTION_NOTIFICATION_TYPE.close : null;

const isStartLivechat = (notification) =>
  LivechatPayload.is.startLivechat(notification) ? INTERACTION_NOTIFICATION_TYPE.success : null;

const isOperatorWriting = (notification) => {
  return LivechatPayload.is.operatorWriting(notification) ? INTERACTION_NOTIFICATION_TYPE.writing : null;
};

const isOperatorDisconnected = (notification) =>
  LivechatPayload.is.operatorDisconnected(notification) ? INTERACTION_NOTIFICATION_TYPE.operatorDisconnected : null;

const isOperatorConnected = (notification) =>
  LivechatPayload.is.operatorConnected(notification) ? INTERACTION_NOTIFICATION_TYPE.operatorConnected : null;

const isOperatorBusy = (notification) =>
  LivechatPayload.is.operatorBusy(notification) ? INTERACTION_NOTIFICATION_TYPE.operatorBusy : null;

const hasOperatorManuallyTransferredDialog = (notification) =>
  LivechatPayload.is.operatorManuallyTransferredDialog(notification)
    ? INTERACTION_NOTIFICATION_TYPE.dialogTransferredManually
    : null;

const hasOperatorAutomaticallyTransferredDialog = (notification) =>
  LivechatPayload.is.operatorAutomaticallyTransferredDialog(notification)
    ? INTERACTION_NOTIFICATION_TYPE.dialogTransferredAutomatically
    : null;

const notificationTypeGetterList = [
  isTimeout,
  isEndLivechat,
  isStartLivechat,
  isOperatorBusy,
  isOperatorConnected,
  isOperatorDisconnected,
  hasOperatorManuallyTransferredDialog,
  hasOperatorAutomaticallyTransferredDialog,
  isOperatorWriting,
];

const getNotificationType = (notification) => {
  let foundType = null;
  let i = 0;
  while (!isDefined(foundType) && i < notificationTypeGetterList.length) {
    const getType = notificationTypeGetterList[i++];
    foundType = getType(notification);
  }
  return foundType;
};

const notificationTypeToIconUrl = {
  [INTERACTION_NOTIFICATION_TYPE.close]: asset('power.svg'),
  [INTERACTION_NOTIFICATION_TYPE.operatorDisconnected]: asset('power.svg'),
  [INTERACTION_NOTIFICATION_TYPE.wait]: asset('clock-countdown.svg'),
  [INTERACTION_NOTIFICATION_TYPE.operatorBusy]: asset('clock-countdown.svg'),
  [INTERACTION_NOTIFICATION_TYPE.success]: asset('check-circle.svg'),
  [INTERACTION_NOTIFICATION_TYPE.operatorConnected]: asset('check-circle.svg'),
  [INTERACTION_NOTIFICATION_TYPE.timeout]: asset('clock.svg'),
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredManually]: asset('check-circle.svg'),
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredAutomatically]: asset('check-circle.svg'),
};

export default function useNotificationHelper(notification) {
  const text = useMemo(() => notification?.values?.text, [notification]) || notification?.text;
  const type = useMemo(() => getNotificationType(notification), [notification]);

  const iconSrc = useMemo(() => (!isDefined(type) ? null : notificationTypeToIconUrl[type]), [type]);
  const isWriting = useMemo(() => {
    if (!isDefined(type)) return null;
    return type?.equals(INTERACTION_NOTIFICATION_TYPE.writing);
  }, [type]);
  return {
    text,
    iconSrc,
    isWriting,
  };
}
