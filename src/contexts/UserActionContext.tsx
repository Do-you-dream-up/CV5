import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

import { useShadow } from './ShadowProvider';

/* THIS CONTEXT IS USED TO CHECK WHETHER THE USER IS NAVIGATING VIA CLICKS OR TAB KEY FOR ACCESSIBILITY REASONS */

interface UserActionProps {
  eventFired?: KeyboardEvent | null;
  tabbing?: boolean;
  shiftPressed?: boolean;
  addRgaaRef?: (name: string, ref) => void;
  getRgaaRef?: (ref) => any;
  rgaaRef?: any;
  removeRgaaRef?: (name: string) => void;
}

interface UserActionProviderProps {
  children?: ReactElement;
}

export const useUserAction = () => useContext(UserActionContext);

export const UserActionContext = createContext<UserActionProps>({});

export function UserActionProvider({ children }: UserActionProviderProps) {
  const [tabbing, setTabbing] = useState(false);
  const [eventFired, setEventFired] = useState(null);
  const [shiftPressed, setShiftPressed] = useState(false);

  const [rgaaRef, setRgaaRef] = useState({});
  const { shadowAnchor } = useShadow();

  const pressedAccessibilityKeyDuringTabbing = (e: { code: string }, tabbing: boolean) => {
    return (
      (e.code === 'Enter' ||
        e.code === 'ShiftLeft' ||
        e.code === 'ShiftRight' ||
        e.code === 'Escape' ||
        e.code === 'Space') &&
      tabbing
    );
  };

  const keyListener = (e) => {
    setEventFired(e);
    setTabbing((prevTabbing) => {
      if (e.key === 'Tab') {
        setShiftPressed(e.shiftKey);
        return true;
      } else if (!pressedAccessibilityKeyDuringTabbing(e, prevTabbing)) {
        setShiftPressed(false);
        return false;
      }
      return prevTabbing;
    });
  };

  const clickListener = () => {
    setTabbing(false);
    setShiftPressed(false);
  };

  useEffect(() => {
    shadowAnchor?.addEventListener('keydown', keyListener);
    shadowAnchor?.addEventListener('mousedown', clickListener);
    return () => {
      shadowAnchor?.removeEventListener('keydown', keyListener);
      shadowAnchor?.removeEventListener('mousedown', clickListener);
    };
  }, []);

  const addRgaaRef = (name, ref) => setRgaaRef({ ...rgaaRef, [name]: ref });

  const getRgaaRef = (name) => {
    const ref = rgaaRef[name];
    if (ref) {
      setTabbing(true);
      return ref;
    }
  };

  const removeRgaaRef = (name) => {
    setRgaaRef((prevState) => {
      const newState = { ...prevState };
      delete newState[name];
      return newState;
    });
  };

  return (
    <UserActionContext.Provider
      children={children}
      value={{
        eventFired,
        tabbing,
        shiftPressed,
        addRgaaRef,
        getRgaaRef,
        rgaaRef,
        removeRgaaRef,
      }}
    />
  );
}
