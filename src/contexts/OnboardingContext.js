import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Local } from '../tools/storage';
import { EventsContext } from './EventsContext';


export const OnboardingContext = React.createContext();
export function OnboardingProvider({ children }) {

  const [ active, setActive ] = useState(!Local.get(Local.names.onboarding));
  const event = useContext(EventsContext).onEvent('onboarding');
  const [ index, setIndex ] = useState(0);
  const { t } = useTranslation('translation');

  const hasPrevious = useCallback(() => !!index, [index]);

  const hasNext = useCallback(() => {
    const steps = t('onboarding.steps') || [];
    return index < steps.length - 1;
  }, [index, t]);

  const onEnd = useCallback(() => {
    setActive(false);
    setIndex(0);
    event('onboardingCompleted');
    Local.set(Local.names.onboarding);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNext = useCallback(() => {
    if (hasNext()) {
      setIndex(previous => previous + 1);
    }
    else {
      onEnd();
    }
  }, [hasNext, onEnd]);

  const onStep = useCallback((index) => {
    setIndex(index);
  }, []);

  const onPrevious = useCallback(() => {
    setIndex(Math.max(index - 1, 0));
  }, [index]);

  return <OnboardingContext.Provider children={children} value={{
    active,
    hasNext,
    hasPrevious,
    index,
    onEnd,
    onNext,
    onPrevious,
    onStep,
  }} />;
}


OnboardingProvider.propTypes = {
  children: PropTypes.object,
};
