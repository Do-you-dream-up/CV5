import { LIVECHAT_ID_LISTENER, TUNNEL_MODE } from '../tools/constants';
import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import SurveyProvider, { useSurvey } from '../Survey/SurveyProvider';
import { isDefined, recursiveBase64DecodeString } from '../tools/helpers';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useDialog } from './DialogContext';
import useDyduPolling from '../tools/hooks/useDyduPolling';
import useDyduWebsocket from '../tools/hooks/useDyduWebsocket';
import { useEvent } from './EventsContext';
import useQueue from '../tools/hooks/useQueue';

interface LivechatContextProps {
  isWebsocket?: boolean;
  send?: (str: string) => void;
  isLivechatOn?: boolean;
  typing?: (input: any) => void;
}

interface LivechatProviderProps {
  children?: ReactElement;
}

export const useLivechat = () => useContext(LivechatContext);

export const LivechatContext = createContext<LivechatContextProps>({});

const isWebsocketTunnel = (tunnel) => tunnel.mode === TUNNEL_MODE.websocket;
const findFirstAvailableTunnelInList = (tunnelList) => tunnelList.find((tunnel) => tunnel.isAvailable());
const findFallbackTunnelInList = (tunnelList) => tunnelList[tunnelList.length - 1];
const containsEndLivechatSpecialAction = (response) => response?.specialAction?.equals('EndPolling');
const containsStartLivechatSpecialAction = (response) => response?.specialAction?.equals('StartPolling');

export function LivechatProvider({ children }: LivechatProviderProps) {
  const [tunnelList] = useState([useDyduWebsocket(), useDyduPolling()]);
  const [tunnel, setTunnel] = useState<any>(null);
  const [isWebsocket, setIsWebsocket] = useState(false);
  const [isLivechatOn, setIsLivechatOn] = useState(false);
  const { showSurvey } = useSurvey();
  const { lastResponse, displayNotification: notify, showAnimationOperatorWriting } = useDialog();
  const { pop, put, list: queue, isEmpty: isQueueEmpty } = useQueue();
  const { onNewMessage } = useEvent();

  const displayResponseText = useCallback(
    (text) => {
      onNewMessage && onNewMessage();
      window.dydu.chat.reply(text);
    },
    [onNewMessage],
  );

  const displayNotification = useCallback(
    (notification) => {
      notify && notify(recursiveBase64DecodeString(notification));
    },
    [notify],
  );

  const shouldEndLivechat = useMemo(() => {
    return isDefined(lastResponse) && containsEndLivechatSpecialAction(lastResponse);
  }, [lastResponse]);

  const shouldStartLivechat = useMemo(() => {
    return isDefined(lastResponse) && containsStartLivechatSpecialAction(lastResponse);
  }, [lastResponse]);

  const onSuccessOpenTunnel = useCallback((tunnel) => {
    const iswebsocket = isWebsocketTunnel(tunnel);
    if (iswebsocket) setIsWebsocket(true);
    setIsLivechatOn(true);
    setTunnel(tunnel);
  }, []);

  const onFailOpenTunnel = useCallback(
    (failedTunnel, err, configuration) => {
      try {
        console.warn(err);
        console.warn('Livechat: while starting: Error with mode ' + (failedTunnel ? failedTunnel.mode : 'unknown'));
        failedTunnel = failedTunnel || tunnel;
        configuration = configuration || tunnelInitialConfig;
        const fallbackTunnel = findFallbackTunnelInList(tunnelList);
        console.warn('Livechat: falling back to mode ' + fallbackTunnel.mode);
        fallbackTunnel.open(configuration).then(() => onSuccessOpenTunnel(fallbackTunnel));
      } catch (error) {
        console.error('An error occurred while handling a failed tunnel opening', error);
      }
    },
    [onSuccessOpenTunnel, tunnelList, tunnel],
  );

  const endLivechat = useCallback(() => {
    console.warn('ending livechat...');
    setIsWebsocket(false);
    setIsLivechatOn(false);
    setTunnel(null);
  }, []);
  const tunnelInitialConfig = useMemo(() => {
    return {
      ...lastResponse,
      api: dydu,
      endLivechat,
      displayResponseText,
      displayNotification,
      onFail: onFailOpenTunnel,
      showAnimationOperatorWriting,
      handleSurvey: showSurvey,
    };
  }, [
    lastResponse,
    dydu,
    onFailOpenTunnel,
    endLivechat,
    displayResponseText,
    displayNotification,
    showAnimationOperatorWriting,
    showSurvey,
  ]);

  const startLivechat = useCallback(
    (tunnel = null) => {
      const _tunnel = tunnel || findFirstAvailableTunnelInList(tunnelList);
      _tunnel
        .open(tunnelInitialConfig)
        .then(() => onSuccessOpenTunnel(_tunnel))
        .catch((err) => onFailOpenTunnel(_tunnel, err, tunnelInitialConfig));
    },
    [
      tunnelList,
      lastResponse,
      endLivechat,
      displayResponseText,
      displayNotification,
      onFailOpenTunnel,
      showAnimationOperatorWriting,
      showSurvey,
      onSuccessOpenTunnel,
    ],
  );

  const sendSurvey = useCallback(
    (surveyResponse) => {
      console.log('livechat sending survey', surveyResponse);
      if (!isDefined(tunnel)) put(surveyResponse);
      else tunnel?.sendSurvey(surveyResponse);
    },
    [tunnel],
  );

  const onUnmount = useCallback(() => {
    SurveyProvider.removeListener(LIVECHAT_ID_LISTENER);
  }, []);

  useEffect(() => {
    if (!isLivechatOn) return onUnmount();
    SurveyProvider.addListener(LIVECHAT_ID_LISTENER, sendSurvey);
  }, [isLivechatOn, sendSurvey]);

  useEffect(() => {
    return onUnmount;
  }, []);

  useEffect(() => {
    const data = Local.livechat.load();
    setIsLivechatOn(data?.isLivechatOn || false);
  }, []);

  useEffect(() => {
    if (shouldEndLivechat) endLivechat();
  }, [shouldEndLivechat, endLivechat]);

  useEffect(() => {
    if (shouldStartLivechat) startLivechat();
  }, [shouldStartLivechat, startLivechat]);

  useEffect(() => {
    if (!isQueueEmpty && isDefined(tunnel?.send)) tunnel.send(pop());
  }, [isQueueEmpty, queue, pop, tunnel?.send, tunnel]);

  const send = useCallback(
    (userInput) => {
      if (!isDefined(tunnel)) return put(userInput);

      const _tunnel = findFirstAvailableTunnelInList(tunnelList);
      const isTunnelStillAvailable = tunnel.mode === _tunnel.mode;
      if (isTunnelStillAvailable) {
        tunnel?.send(userInput);
      } else {
        startLivechat(_tunnel);
      }
    },
    [put, tunnel],
  );

  const typing = useCallback(
    (input) => {
      tunnel?.onUserTyping(input);
    },
    [tunnel],
  );

  const dataContext = useMemo(
    () => ({
      isWebsocket,
      send,
      isLivechatOn,
      typing,
      displayResponseText,
      sendSurvey,
    }),
    [isLivechatOn, isWebsocket, send, typing, displayResponseText, sendSurvey],
  );
  return <LivechatContext.Provider value={dataContext}>{children}</LivechatContext.Provider>;
}
