import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Local } from '../tools/storage';
import PropTypes from 'prop-types';
import { useConfiguration } from './ConfigurationContext';
import { useCookie } from 'react-use';
import { VIEW_MODE } from '../tools/constants';

const ViewModeContext = createContext();
export const useViewMode = () => useContext(ViewModeContext);

export default function ViewModeProvider({ children }) {
  const { configuration } = useConfiguration();
  const [value, updateCookie] = useCookie(Local.names.open);
  const defaultMode = useMemo(() => parseInt(value) || configuration.application.open, [value]);
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
    updateCookie(mode);
  }, [mode]);

  useEffect(() => {
    if (value) {
      setMode(mode);
    }
  }, [value]);

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
