import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Local } from '../tools/storage';
import PropTypes from 'prop-types';
import { VIEW_MODE } from '../tools/constants';
import { useConfiguration } from './ConfigurationContext';
import { useLocalStorage } from 'react-use';

const ViewModeContext = createContext();
export const useViewMode = () => useContext(ViewModeContext);

export default function ViewModeProvider({ children }) {
  const { configuration } = useConfiguration();
  const [viewMode, updateViewMode] = useLocalStorage(Local.names.open);
  const defaultMode = useMemo(() => parseInt(viewMode) || configuration.application.open, [viewMode]);
  const [mode, setMode] = useState(defaultMode);
  const isOpen = useMemo(() => mode > VIEW_MODE.minimize, [mode]);
  const isFull = useMemo(() => mode === VIEW_MODE.full, [mode]);
  const isPopin = useMemo(() => mode === VIEW_MODE.popin, [mode]);
  const isClose = useMemo(() => mode === VIEW_MODE.close, [mode]);
  const isMinimize = useMemo(() => mode === VIEW_MODE.minimize, [mode]);

  const toggle = useCallback((val) => () => setMode(~~val), []);

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
    updateViewMode(mode);
  }, [mode]);

  useEffect(() => {
    if (viewMode) {
      setMode(mode);
    }
  }, [viewMode]);

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
