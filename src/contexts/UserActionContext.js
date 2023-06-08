import { createContext, useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

/* THIS CONTEXT IS USED TO CHECK WHETHER THE USER IS NAVIGATING VIA CLICKS OR TAB KEY FOR ACCESSIBILITY REASONS */

export const useUserAction = () => useContext(UserActionContext);

export const UserActionContext = createContext();

export function UserActionProvider({ children }) {
  const [tabbing, setTabbing] = useState(false);

  const [rgaaRef, setRgaaRef] = useState({});

  useEffect(() => {
    const keyListener = (e) => {
      if (e.keyCode === 9) {
        setTabbing(true);
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => {
      document.removeEventListener('keydown', keyListener);
    };
  }, []);

  useEffect(() => {
    const clickListener = () => {
      setTabbing(false);
    };
    document.addEventListener('click', clickListener);
    return () => {
      document.removeEventListener('click', clickListener);
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
        tabbing,
        addRgaaRef,
        getRgaaRef,
        rgaaRef,
        removeRgaaRef,
      }}
    />
  );
}

UserActionProvider.propTypes = {
  children: PropTypes.object,
};
