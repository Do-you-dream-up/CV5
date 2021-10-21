import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

/* THIS CONTEXT IS USED TO CHECK WHETHER THE USER IS NAVIGATING VIA CLICKS OR TAB KEY FOR ACCESSIBILITY REASONS */

export const UserActionContext = React.createContext();
export function UserActionProvider({ children }) {
  const [tabbing, setTabbing] = useState(false);

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

  return (
    <UserActionContext.Provider
      children={children}
      value={{
        tabbing,
      }}
    />
  );
}

UserActionProvider.propTypes = {
  children: PropTypes.object,
};
