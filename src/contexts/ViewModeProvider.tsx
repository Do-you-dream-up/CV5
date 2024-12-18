import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Local } from '../tools/storage';
import { VIEW_MODE } from '../tools/constants';
import { useConfiguration } from './ConfigurationContext';
import { useLocalStorage } from 'react-use';

interface ViewModeContextProps {
  isOpen?: boolean;
  toggle?: (mode: number) => void;
  mode?: number;
  close?: () => void;
  popin?: () => void;
  openFull?: () => void;
  minimize?: () => void;
  isFull?: boolean;
  isPopin?: boolean;
  isClose?: boolean;
  isMinimize?: boolean;
}

interface ViewModeProviderProps {
  children?: ReactElement;
}

export const useViewMode = () => useContext(ViewModeContext);

const ViewModeContext = createContext<ViewModeContextProps>({});

export default function ViewModeProvider({ children }: ViewModeProviderProps) {
  const { configuration } = useConfiguration();

  const [viewMode, updateViewMode, removeViewMode] = useLocalStorage<any>(Local.names.open);
  const defaultMode = useMemo(() => parseInt(viewMode) || configuration?.application.open, [viewMode]);
  const [mode, setMode] = useState<any>(defaultMode);

  const isFull = mode && mode === VIEW_MODE.full;
  const isPopin = mode && mode === VIEW_MODE.popin;
  const isClose = mode && mode === VIEW_MODE.close;
  const isMinimize = mode === null || mode === undefined || mode === VIEW_MODE.minimize;
  const isOpen = isPopin || isFull;

  const toggle = (val: number) => {
    setMode(~~val);
  };

  const close = useCallback(() => {
    !isClose && setMode(VIEW_MODE.close);
  }, [isClose]);

  const popin = useCallback(() => {
    !isPopin && setMode(VIEW_MODE.popin);
  }, [isPopin]);

  const openFull = useCallback(() => {
    !isFull && setMode(VIEW_MODE.full);
  }, [isFull]);

  const minimize = useCallback(() => {
    !isMinimize && setMode(VIEW_MODE.minimize);
  }, [isMinimize]);

  useEffect(() => {
    if (mode !== VIEW_MODE.minimize) {
      Local.viewMode.save(mode);
      updateViewMode(mode);
    } else {
      Local.viewMode.remove(mode);
      removeViewMode();
    }
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
