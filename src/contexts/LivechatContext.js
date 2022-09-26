import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDialog } from './DialogContext';
import { isDefined, recursiveBase64DecodeString } from '../tools/helpers';
import dydu from '../tools/dydu';
import useDyduWebsocket from '../tools/hooks/useDyduWebsocket';
import useDyduPolling from '../tools/hooks/useDyduPolling';
import { Local } from '../tools/storage';
import useQueue from '../tools/hooks/useQueue';
import SurveyProvider, { useSurvey } from '../Survey/SurveyProvider';
import LivechatPayload from '../tools/LivechatPayload';

export const TUNNEL_MODE = {
  polling: 'polling',
  websocket: 'websocket',
};

const LivechatContext = React.createContext({});
export const useLivechat = () => useContext(LivechatContext);

const isWebsocketTunnel = (tunnel) => tunnel.mode === TUNNEL_MODE.websocket;
const findFirstAvailableTunnelInList = (tunnelList) => tunnelList.find((tunnel) => tunnel.isAvailable());
const findFallbackTunnelInList = (tunnelList) => tunnelList[tunnelList.length - 1];
const containsEndLivechatSpecialAction = (response) => response?.specialAction?.equals('EndPolling');
const containsStartLivechatSpecialAction = (response) => response?.specialAction?.equals('StartPolling');

const LIVECHAT_ID_LISTENER = 'listener/livechat';

export function LivechatProvider({ children }) {
  const [tunnelList] = useState([useDyduWebsocket(), useDyduPolling()]);
  const [tunnel, setTunnel] = useState(null);
  const [isWebsocket, setIsWebsocket] = useState(false);
  const [isLivechatOn, setIsLivechatOn] = useState(false);
  const { showSurvey, setLivechatSendSurveyFn } = useSurvey();
  const { lastResponse, displayNotification: notify, showAnimationOperatorWriting } = useDialog();
  const { pop, put, list: queue, isEmpty: isQueueEmpty } = useQueue();
  const displayResponseText = useCallback((text) => window.dydu.chat.reply(text), []);

  const displayNotification = useCallback(
    (notification) => {
      notify(recursiveBase64DecodeString(notification));
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
      console.warn(err);
      console.warn('Livechat: while starting: Error with mode ' + failedTunnel.mode);
      const fallbackTunnel = findFallbackTunnelInList(tunnelList);
      console.warn('Livechat: falling back to mode ' + fallbackTunnel.mode);
      fallbackTunnel.open(configuration).then(() => onSuccessOpenTunnel(fallbackTunnel));
    },
    [onSuccessOpenTunnel, tunnelList],
  );

  const endLivechat = useCallback(() => {
    console.warn('ending livechat...');
    setIsWebsocket(false);
    setIsLivechatOn(false);
    setTunnel(null);
  }, []);

  const startLivechat = useCallback(() => {
    const _tunnel = findFirstAvailableTunnelInList(tunnelList);
    const tunnelInitialConfig = {
      ...lastResponse,
      api: dydu,
      endLivechat,
      displayResponseText,
      displayNotification,
      onFail: onFailOpenTunnel,
      showAnimationOperatorWriting,
      handleSurvey: showSurvey,
    };
    _tunnel
      .open(tunnelInitialConfig)
      .then(() => onSuccessOpenTunnel(_tunnel))
      .catch((err) => onFailOpenTunnel(_tunnel, err, tunnelInitialConfig));
  }, [
    tunnelList,
    lastResponse,
    endLivechat,
    displayResponseText,
    displayNotification,
    onFailOpenTunnel,
    showAnimationOperatorWriting,
    showSurvey,
    onSuccessOpenTunnel,
  ]);

  const sendSurvey = useCallback(
    (survey) => {
      console.log('livechat sending survey !', survey);
      send(survey);
    },
    [send],
  );

  const onUnmount = useCallback(() => {
    SurveyProvider.removeListener(LIVECHAT_ID_LISTENER);
  }, []);

  useEffect(() => {
    console.log('livechat on ??', isLivechatOn);
  }, [isLivechatOn]);

  useEffect(() => {
    if (!isLivechatOn) return SurveyProvider.removeListener(LIVECHAT_ID_LISTENER);
    SurveyProvider.addListener(LIVECHAT_ID_LISTENER, sendSurvey);
  }, [isLivechatOn, setLivechatSendSurveyFn, sendSurvey]);

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
      if (!isDefined(tunnel)) put(userInput);
      else tunnel?.send(userInput);
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
    }),
    [isLivechatOn, isWebsocket, send, typing],
  );
  return <LivechatContext.Provider value={dataContext}>{children}</LivechatContext.Provider>;
}

LivechatProvider.propTypes = {
  children: PropTypes.object,
};
