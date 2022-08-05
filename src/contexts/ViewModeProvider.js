import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Local } from '../tools/storage';
import { useConfiguration } from './ConfigurationContext';

const ViewModeContext = React.createContext();
export const useViewMode = () => useContext(ViewModeContext);

const VIEW_MODE = {
  close: 0, // hidden
  minimize: 1, // teaser
  popin: 2,
  full: 3,
};

export default function ViewModeProvider({ children }) {
  const { configuration } = useConfiguration();
  const [mode, setMode] = useState(configuration.application.open);

  const isOpen = useMemo(() => mode > VIEW_MODE.minimize, [mode]);
  const isFull = useMemo(() => mode === VIEW_MODE.full, [mode]);
  const isPopin = useMemo(() => mode === VIEW_MODE.popin, [mode]);
  const isClose = useMemo(() => mode === VIEW_MODE.close, [mode]);
  const isMinimize = useMemo(() => mode === VIEW_MODE.minimize, [mode]);

  const toggle = useCallback((value) => () => setMode(~~value), []);

  const close = useCallback(() => {
    if (!isClose) setMode(VIEW_MODE.close);
  }, [isClose]);

  const popin = useCallback(() => {
    if (!isPopin) setMode(VIEW_MODE.popin);
  }, [isPopin]);

  const openFull = useCallback(() => {
    if (!isFull) setMode(VIEW_MODE.full);
  }, [isFull]);

  const minimize = useCallback(() => {
    if (!isMinimize) setMode(VIEW_MODE.minimize);
  }, [isMinimize]);

  useEffect(() => {
    Local.viewMode.save(mode);
  }, [mode]);

  const context = useMemo(
    () => ({
      toggle,
      mode,
      close,
      popin,
      openFull,
      minimize,
      isOpen,
      isFull,
      isPopin,
      isClose,
      isMinimize,
    }),
    [toggle, mode, close, popin, openFull, minimize, isOpen, isFull, isPopin, isClose, isMinimize],
  );

  return <ViewModeContext.Provider value={context}>{children}</ViewModeContext.Provider>;
}

ViewModeProvider.propTypes = {
  children: PropTypes.any,
};
