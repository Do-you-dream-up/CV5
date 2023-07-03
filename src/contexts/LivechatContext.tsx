import { LIVECHAT_ID_LISTENER, TUNNEL_MODE } from '../tools/constants';
import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import SurveyProvider, { useSurvey } from '../Survey/SurveyProvider';
import { isDefined, recursiveBase64DecodeString } from '../tools/helpers';

import LivechatPayload from '../tools/LivechatPayload';
import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useDialog } from './DialogContext';
import useDyduPolling from '../tools/hooks/useDyduPolling';
import useDyduWebsocket from '../tools/hooks/useDyduWebsocket';
import { useEvent } from './EventsContext';

interface LivechatContextProps {
  isWebsocket?: boolean;
  send?: (str: string, options?) => void;
  sendSurvey?: (str: string) => void;
  typing?: (input: any) => void;
  displayResponseText?: (str: string) => void;
}

interface LivechatProviderProps {
  children?: ReactElement;
}

export const LivechatContext = createContext<LivechatContextProps>({});

export const useLivechat = () => useContext(LivechatContext);

const isWebsocketTunnel = (tunnel) => tunnel?.mode === TUNNEL_MODE?.websocket;
const findFirstAvailableTunnelInList = (tunnelList) => tunnelList.find((tunnel) => tunnel.isAvailable());
const findFallbackTunnelInList = (tunnelList) => tunnelList[tunnelList.length - 1];
const containsStartLivechat = (response) => LivechatPayload.is.startLivechat(response);
const containsEndLivechat = (response) => LivechatPayload.is.endPolling(response);

export function LivechatProvider({ children }: LivechatProviderProps) {
  const [tunnelList] = useState([useDyduWebsocket(), useDyduPolling()]);
  const [tunnel, setTunnel] = useState<any>(null);
  const [isWebsocket, setIsWebsocket] = useState(false);
  const { showSurvey } = useSurvey();
  const { lastResponse, displayNotification: notify, showAnimationOperatorWriting } = useDialog();
  const { onNewMessage } = useEvent();

  /* Init isLivechatOn value if not present */
  useEffect(() => {
    if (!Local.isLivechatOn.load()) {
      Local.isLivechatOn.save(false);
    }
  }, [Local.isLivechatOn.load()]);

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
    return isDefined(lastResponse) && containsEndLivechat(lastResponse);
  }, [lastResponse]);

  const shouldStartLivechat = useMemo(() => {
    return Local.isLivechatOn.load() || (isDefined(lastResponse) && containsStartLivechat(lastResponse));
  }, [lastResponse, Local.isLivechatOn.load()]);

  const onSuccessOpenTunnel = (tunnel) => {
    const iswebsocket = isWebsocketTunnel(tunnel);
    if (iswebsocket) setIsWebsocket(true);
    Local.isLivechatOn.save(true);
    setTunnel(tunnel);
  };

  const onFailOpenTunnel = useCallback(
    (failedTunnel, err, configuration) => {
      try {
        console.warn(err);
        console.warn('Livechat: while starting: Error with mode ' + (failedTunnel ? failedTunnel.mode : 'unknown'));
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

  const endLivechat = () => {
    console.warn('ending livechat...');
    setIsWebsocket(false);
    Local.isLivechatOn.save(false);
    setTunnel(null);
  };

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

  const startLivechat = (tunnel = null) => {
    const _tunnel = tunnel || findFirstAvailableTunnelInList(tunnelList);

    _tunnel
      ?.open(tunnelInitialConfig)
      .then(() => {
        onSuccessOpenTunnel(_tunnel);
      })
      .catch((err) => {
        onFailOpenTunnel(_tunnel, err, tunnelInitialConfig);
      });
  };

  const sendSurvey = useCallback(
    (surveyResponse) => {
      tunnel?.sendSurvey(surveyResponse);
    },
    [tunnel],
  );

  const onUnmount = useCallback(() => {
    SurveyProvider.removeListener(LIVECHAT_ID_LISTENER);
  }, []);

  useEffect(() => {
    if (!Local.isLivechatOn.load()) return onUnmount();
    SurveyProvider.addListener(LIVECHAT_ID_LISTENER, sendSurvey);
  }, [Local.isLivechatOn.load(), sendSurvey]);

  useEffect(() => {
    if (shouldEndLivechat) endLivechat();
  }, [shouldEndLivechat, endLivechat]);

  useEffect(() => {
    if (shouldStartLivechat && !tunnel) {
      startLivechat();
    }
  }, [shouldStartLivechat]);

  const send = useCallback(
    (userInput, options) => {
      const _tunnel = findFirstAvailableTunnelInList(tunnelList);
      const isTunnelStillAvailable = tunnel?.mode && tunnel?.mode === _tunnel?.mode && _tunnel?.mode;
      if (isTunnelStillAvailable) {
        tunnel?.send(userInput, options);
      } else {
        startLivechat(_tunnel);
      }
    },
    [tunnel, Local.isLivechatOn.load()],
  );
  const typing = useCallback(
    (input) => {
      if (Local.isLivechatOn.load()) {
        tunnel?.onUserTyping(input);
      }
    },
    [tunnel],
  );

  const props = useMemo(
    () => ({
      isWebsocket,
      send,
      sendSurvey,
      displayResponseText,
      typing,
    }),
    [isWebsocket, send, sendSurvey, displayResponseText, typing],
  );
  return <LivechatContext.Provider value={props}>{children}</LivechatContext.Provider>;
}
