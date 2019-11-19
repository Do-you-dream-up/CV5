import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Local } from '../tools/storage';


export const OnboardingContext = React.createContext();
export function OnboardingProvider({ children }) {

  const [ active, setActive ] = useState(!Local.get(Local.names.onboarding));
  const [ index, setIndex ] = useState(0);

  const hasPrevious = useCallback(() => !!index, [index]);

  const hasNext = useCallback(() => {
    const steps = [];
    return index < steps.length - 1;
  }, [index]);

  const next = useCallback(() => {
    if (hasNext()) {
      setIndex(previous => previous + 1);
    }
    else {
      end();
    }
    // eslint-disable-next-line no-use-before-define
  }, [end, hasNext]);

  const previous = useCallback(() => {
    setIndex(Math.max(index - 1, 0));
  }, [index]);

  const end = useCallback(() => {
    setActive(false);
    setIndex(0);
    Local.set(Local.names.onboarding);
  }, []);

  return <OnboardingContext.Provider children={children} value={{
    end,
    hasNext,
    hasPrevious,
    next,
    previous,
    state: {active, index},
  }} />;
}


OnboardingProvider.propTypes = {
  children: PropTypes.object,
};
