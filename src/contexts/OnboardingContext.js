import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Local } from '../tools/storage';


export const OnboardingContext = React.createContext();
export function OnboardingProvider({ children }) {

  const [ active, setActive ] = useState(!Local.get(Local.names.onboarding));
  const [ index, setIndex ] = useState(0);
  const { t } = useTranslation('onboarding');

  const hasPrevious = useCallback(() => !!index, [index]);

  const hasNext = useCallback(() => {
    const steps = t('steps') || [];
    return index < steps.length - 1;
  }, [index, t]);

  const onEnd = useCallback(() => {
    setActive(false);
    setIndex(0);
    Local.set(Local.names.onboarding);
  }, []);

  const onNext = useCallback(() => {
    if (hasNext()) {
      setIndex(previous => previous + 1);
    }
    else {
      onEnd();
    }
  }, [hasNext, onEnd]);

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
  }} />;
}


OnboardingProvider.propTypes = {
  children: PropTypes.object,
};
