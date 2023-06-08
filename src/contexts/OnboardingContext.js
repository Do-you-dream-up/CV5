import { createContext, useCallback, useContext, useRef, useState } from 'react';

import { EventsContext } from './EventsContext';
import { Local } from '../tools/storage';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const useOnboarding = () => useContext(OnboardingContext);
export const OnboardingContext = createContext();
export function OnboardingProvider({ children }) {
  const [active, setActive] = useState(!Local.get(Local.names.onboarding));
  const event = useContext(EventsContext).onEvent('onboarding');
  const [index, setIndex] = useState(0);
  const { t } = useTranslation('translation');
  const carouselRef = useRef(null);

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
      setIndex((previous) => previous + 1);
      carouselRef.current?.focus();
    } else {
      onEnd();
    }
  }, [hasNext, onEnd]);

  const onStep = useCallback((index) => {
    setIndex(index);
  }, []);

  const onPrevious = useCallback(() => {
    setIndex(Math.max(index - 1, 0));
    carouselRef.current?.focus();
  }, [index]);

  return (
    <OnboardingContext.Provider
      children={children}
      value={{
        carouselRef,
        active,
        hasNext,
        hasPrevious,
        index,
        onEnd,
        onNext,
        onPrevious,
        onStep,
      }}
    />
  );
}

OnboardingProvider.propTypes = {
  children: PropTypes.object,
};
