import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

import { useShadow } from './ShadowProvider';

/* THIS CONTEXT IS USED TO CHECK WHETHER THE USER IS NAVIGATING VIA CLICKS OR TAB KEY FOR ACCESSIBILITY REASONS */

interface UserActionProps {
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
  const [tabbing, setTabbing] = useState(true);
  const [tabPressed, setTabPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  const [rgaaRef, setRgaaRef] = useState({});
  const { shadowAnchor } = useShadow();

  useEffect(() => {
    const keyListener = (e) => {
      if (e.keyCode === 9) {
        setTabbing(true);
        setTabPressed(true);
      } else if (e.keyCode === 13 && tabPressed) {
        setTabbing(true);
      } else if (e.keyCode === 16) {
        setShiftPressed(true);
      } else {
        setTabbing(false);
        setTabPressed(false);
        setShiftPressed(false);
      }
    };
    shadowAnchor?.addEventListener('keydown', keyListener);
    return () => {
      shadowAnchor?.removeEventListener('keydown', keyListener);
    };
  }, [tabPressed]);

  useEffect(() => {
    const clickListener = () => {
      if (!tabPressed) {
        setTabbing(false);
      }
      setTabPressed(false);
      setShiftPressed(false);
    };
    shadowAnchor?.addEventListener('click', clickListener);
    return () => {
      shadowAnchor?.removeEventListener('click', clickListener);
    };
  }, [tabPressed]);

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
