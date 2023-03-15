import { INTERACTION_NOTIFICATION_TYPE } from '../constants';
import LivechatPayload from '../LivechatPayload';
import icons from '../../tools/icon-constants';
import { isDefined } from '../helpers';
import { useMemo } from 'react';

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

const notificationTypeToIconName = {
  [INTERACTION_NOTIFICATION_TYPE.close]: icons.power,
  [INTERACTION_NOTIFICATION_TYPE.operatorDisconnected]: icons.power,
  [INTERACTION_NOTIFICATION_TYPE.wait]: icons.timer,
  [INTERACTION_NOTIFICATION_TYPE.operatorBusy]: icons.timer,
  [INTERACTION_NOTIFICATION_TYPE.success]: icons.checkCircle,
  [INTERACTION_NOTIFICATION_TYPE.operatorConnected]: icons.checkCircle,
  [INTERACTION_NOTIFICATION_TYPE.timeout]: icons.time,
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredManually]: icons.checkCircle,
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredAutomatically]: icons.checkCircle,
};

export default function useNotificationHelper(notification) {
  const text = useMemo(() => notification?.values?.text, [notification]) || notification?.text;
  const type = useMemo(() => getNotificationType(notification), [notification]);

  const iconName = useMemo(() => (!isDefined(type) ? null : notificationTypeToIconName[type]), [type]);

  const isWriting = useMemo(() => {
    if (!isDefined(type)) return null;
    return type?.equals(INTERACTION_NOTIFICATION_TYPE.writing);
  }, [type]);

  return {
    text,
    iconName,
    isWriting,
  };
}
