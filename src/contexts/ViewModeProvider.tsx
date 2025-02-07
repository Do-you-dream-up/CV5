import { ReactElement, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Local } from '../tools/storage';
import { VIEW_MODE } from '../tools/constants';
import { useConfiguration } from './ConfigurationContext';

interface ViewModeContextProps {
  isOpen?: boolean;
  mode?: number;
  setMode?: (mode: number) => void;
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

  const [mode, setMode] = useState<any>(parseInt(Local.viewMode.load() || configuration?.application.open));

  const [isFull, setIsFull] = useState<boolean>(mode === VIEW_MODE.full);
  const [isPopin, setIsPopin] = useState<boolean>(mode === VIEW_MODE.popin);
  const [isClose, setIsClose] = useState<boolean>(mode === VIEW_MODE.close);
  const [isMinimize, setIsMinimize] = useState<boolean>(
    mode === null || mode === undefined || mode === VIEW_MODE.minimize,
  );
  const [isOpen, setIsOpen] = useState<boolean>(mode === VIEW_MODE.popin || mode === VIEW_MODE.full);

  /*
    never store in local minimized value, a no value in local is interpreted as minimized
  */
  useEffect(() => {
    if (mode !== VIEW_MODE.minimize) {
      Local.viewMode.save(mode);
    } else {
      Local.viewMode.remove(mode);
    }
    setIsFull(mode === VIEW_MODE.full);
    setIsPopin(mode === VIEW_MODE.popin);
    setIsClose(mode === VIEW_MODE.close);
    setIsMinimize(mode === null || mode === undefined || mode === VIEW_MODE.minimize);
    setIsOpen(mode === VIEW_MODE.popin || mode === VIEW_MODE.full);
  }, [mode]);

  const context = useMemo(
    () => ({
      mode,
      setMode,
      isOpen,
      isFull,
      isPopin,
      isClose,
      isMinimize,
    }),
    [mode, setMode, isOpen, isFull, isPopin, isClose, isMinimize],
  );

  return <ViewModeContext.Provider value={context}>{children}</ViewModeContext.Provider>;
}
