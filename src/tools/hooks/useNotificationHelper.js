import { INTERACTION_NOTIFICATION_TYPE } from '../constants';
import LivechatPayload from '../LivechatPayload';
import icons from '../../tools/icon-constants';
import { isDefined } from '../helpers';
import { useMemo } from 'react';

const getNotificationType = (notification) => {
  if (LivechatPayload.is.timeout(notification)) return INTERACTION_NOTIFICATION_TYPE.timeout;
  if (LivechatPayload.is.endPolling(notification)) return INTERACTION_NOTIFICATION_TYPE.close;
  if (LivechatPayload.is.startLivechat(notification)) return INTERACTION_NOTIFICATION_TYPE.success;
  if (LivechatPayload.is.operatorBusy(notification)) return INTERACTION_NOTIFICATION_TYPE.operatorBusy;
  if (LivechatPayload.is.operatorConnected(notification)) return INTERACTION_NOTIFICATION_TYPE.operatorConnected;
  if (LivechatPayload.is.operatorDisconnected(notification)) return INTERACTION_NOTIFICATION_TYPE.operatorDisconnected;
  if (LivechatPayload.is.operatorManuallyTransferredDialog(notification))
    return INTERACTION_NOTIFICATION_TYPE.dialogTransferredManually;
  if (LivechatPayload.is.operatorAutomaticallyTransferredDialog(notification))
    return INTERACTION_NOTIFICATION_TYPE.dialogTransferredAutomatically;
  if (LivechatPayload.is.operatorWriting(notification)) return INTERACTION_NOTIFICATION_TYPE.writing;
  if (LivechatPayload.is.leaveWaitingQueue(notification)) return INTERACTION_NOTIFICATION_TYPE.leaveWaitingQueue;
  if (LivechatPayload.is.startWaitingQueue(notification)) return INTERACTION_NOTIFICATION_TYPE.waitingQueue;
  if (LivechatPayload.is.liveChatConnectionInQueue(notification))
    return INTERACTION_NOTIFICATION_TYPE.dmLiveChatConnectionInQueue;
  return null;
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
  [INTERACTION_NOTIFICATION_TYPE.waitingQueue]: icons.checkCircle,
  [INTERACTION_NOTIFICATION_TYPE.leaveWaitingQueue]: icons.checkCircle,
  [INTERACTION_NOTIFICATION_TYPE.dmLiveChatConnectionInQueue]: icons.checkCircle,
};

export default function useNotificationHelper(notification) {
  const text = useMemo(() => notification?.values?.text, [notification]) || notification?.text;
  const type = useMemo(() => getNotificationType(notification), [notification]);

  const iconName = useMemo(() => (!isDefined(type) ? null : notificationTypeToIconName[type]), [type]);

  return {
    text,
    iconName,
  };
}
