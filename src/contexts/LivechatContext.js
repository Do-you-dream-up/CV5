import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDialog } from './DialogContext';
import { isDefined } from '../tools/helpers';
import dydu from '../tools/dydu';
import useDyduWebsocket from '../tools/hooks/useDyduWebsocket';
import useDyduPolling from '../tools/hooks/useDyduPolling';

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

export function LivechatProvider({ children }) {
  const [tunnelList] = useState([useDyduWebsocket(), useDyduPolling()]);
  const [tunnel, setTunnel] = useState(null);
  const [isWebsocket, setIsWebsocket] = useState(false);
  const { lastResponse, setStatusText } = useDialog();

  const displayResponseText = useCallback(
    (text) => {
      setStatusText(null);
      window.dydu.chat.reply(text);
    },
    [setStatusText],
  );

  const displayStatusText = useCallback(setStatusText, [setStatusText]);

  const shouldEndLivechat = useMemo(() => {
    return isDefined(lastResponse) && containsEndLivechatSpecialAction(lastResponse);
  }, [lastResponse]);

  const shouldStartLivechat = useMemo(() => {
    return isDefined(lastResponse) && containsStartLivechatSpecialAction(lastResponse);
  }, [lastResponse]);

  const onSuccessOpenTunnel = useCallback((tunnel) => {
    const iswebsocket = isWebsocketTunnel(tunnel);
    if (iswebsocket) setIsWebsocket(true);
    setTunnel(tunnel);
  }, []);

  const onFailOpenTunnel = useCallback(
    (failedTunnel, err, configuration) => {
      console.warn(err);
      console.warn('Livechat: while starting: Error with mode ' + failedTunnel.mode);
      const fallbackTunnel = findFallbackTunnelInList(tunnelList);
      console.warn('Livechat: falling back to mode ' + fallbackTunnel.mode);
      fallbackTunnel.open(configuration).then(onSuccessOpenTunnel(fallbackTunnel));
    },
    [onSuccessOpenTunnel, tunnelList],
  );

  const endLivechat = useCallback(() => {
    console.warn('ending livechat...');
    setIsWebsocket(false);
    setTunnel(null);
  }, []);

  const startLivechat = useCallback(() => {
    const _tunnel = findFirstAvailableTunnelInList(tunnelList);
    const tunnelInitialConfig = {
      ...lastResponse,
      api: dydu,
      endLivechat,
      displayResponseText,
      displayStatusText,
      onFail: onFailOpenTunnel,
    };
    _tunnel
      .open(tunnelInitialConfig)
      .then(() => onSuccessOpenTunnel(_tunnel))
      .catch((err) => onFailOpenTunnel(_tunnel, err, tunnelInitialConfig));
  }, [
    displayResponseText,
    displayStatusText,
    endLivechat,
    lastResponse,
    onFailOpenTunnel,
    onSuccessOpenTunnel,
    tunnelList,
  ]);

  useEffect(() => {
    if (shouldEndLivechat) endLivechat();
  }, [shouldEndLivechat, endLivechat]);

  useEffect(() => {
    if (shouldStartLivechat) startLivechat();
  }, [shouldStartLivechat, startLivechat]);

  const send = useCallback(
    (userInput) => {
      tunnel?.send(userInput);
    },
    [tunnel],
  );

  const dataContext = useMemo(
    () => ({
      isWebsocket,
      send,
    }),
    [isWebsocket, send],
  );
  return <LivechatContext.Provider value={dataContext}>{children}</LivechatContext.Provider>;
}

LivechatProvider.propTypes = {
  children: PropTypes.object,
};
