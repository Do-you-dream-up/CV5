import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';

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
  focusTrap?: (
    eventFired: KeyboardEvent | null | undefined,
    root: React.MutableRefObject<any>,
    shadowRoot: ShadowRoot | null | undefined,
    querySelector: string,
  ) => void;
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
  const { shadowAnchor, shadowRoot } = useShadow();

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
      const activeElement = shadowRoot?.activeElement;
      const tagName = activeElement?.tagName?.toLowerCase();
      const isInputOrTextarea = tagName === 'input' || tagName === 'textarea';
      if (
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        ((e.key === 'Enter' || e.key === ' ') && !isInputOrTextarea)
      ) {
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

  const focusTrap = (
    eventFired: KeyboardEvent | null | undefined,
    root: React.MutableRefObject<any>,
    shadowRoot: ShadowRoot | null | undefined,
    querySelector: string,
  ) => {
    const rootElement = root.current;
    const focusableElements = rootElement ? rootElement.querySelectorAll(querySelector) : [];
    if (focusableElements.length > 0 && eventFired?.key === 'Tab') {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (eventFired?.shiftKey && shadowRoot?.activeElement === firstElement) {
        eventFired?.preventDefault();
        lastElement.focus();
      } else if (!eventFired?.shiftKey && shadowRoot?.activeElement === lastElement) {
        eventFired?.preventDefault();
        firstElement.focus();
      }
    }
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
        focusTrap,
      }}
    />
  );
}
