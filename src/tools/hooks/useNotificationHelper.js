import { INTERACTION_NOTIFICATION_TYPE } from '../constants';
import LivechatPayload from '../LivechatPayload';
import { isDefined } from '../helpers';
import { useMemo } from 'react';
import { PowerIcon, TimerIcon, CheckCircleIcon, TimeIcon } from '../../components/CustomIcons/CustomIcons';

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
  [INTERACTION_NOTIFICATION_TYPE.close]: <PowerIcon />,
  [INTERACTION_NOTIFICATION_TYPE.operatorDisconnected]: <PowerIcon />,
  [INTERACTION_NOTIFICATION_TYPE.wait]: <TimerIcon />,
  [INTERACTION_NOTIFICATION_TYPE.operatorBusy]: <TimerIcon />,
  [INTERACTION_NOTIFICATION_TYPE.success]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.operatorConnected]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.timeout]: <TimeIcon />,
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredManually]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.dialogTransferredAutomatically]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.waitingQueue]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.leaveWaitingQueue]: <CheckCircleIcon />,
  [INTERACTION_NOTIFICATION_TYPE.dmLiveChatConnectionInQueue]: <CheckCircleIcon />,
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
