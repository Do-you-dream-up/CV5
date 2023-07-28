import { ReactElement, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { EventsContext } from './EventsContext';
import { Local } from '../tools/storage';
import { useConfiguration } from './ConfigurationContext';
import { useTranslation } from 'react-i18next';

interface OnboardingContextProps {
  isOnboardingAlreadyDone?: boolean;
  hasNext?: () => void;
  hasPrevious?: () => void;
  stepIndex?: number | undefined;
  onEnd?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onStep?: (idx: number) => void;
  carouselRef?: any;
  stepsFiltered?: Step[];
  currentStepImage?: string | null;
  srcImage?: string;
  isOnboardingNeeded?: boolean;
}

interface OnboardingProviderProps {
  children?: ReactElement;
}

interface Image {
  src: string;
  hidden: boolean;
}

interface Step {
  disabled: boolean;
  title: string;
  body: string;
  image?: Image;
}

export const OnboardingContext = createContext<OnboardingContextProps>({});
export const useOnboarding = () => useContext(OnboardingContext);
export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { configuration } = useConfiguration();
  const [isOnboardingAlreadyDone, setIsOnboardingAlreadyDone] = useState(!!Local.get(Local.names.onboarding));
  const event = useContext?.(EventsContext)?.onEvent?.('onboarding');
  const [stepIndex, setStepIndex] = useState(0);
  const { t, ready: isTranslationLoaded } = useTranslation('translation');
  const isOnboardingNeeded = isTranslationLoaded && !isOnboardingAlreadyDone;
  const carouselRef = useRef<HTMLElement | null>(null);
  const { enable: isOnboardingEnabled, items: onboardingItems } = configuration?.onboarding || {};

  const onboardingStepsTrad: Step[] = t('onboarding.steps') || [];
  const steps: Step[] = isOnboardingNeeded
    ? onboardingStepsTrad?.map((step, index) => ({
        ...step,
        image: onboardingItems?.[index].image,
      }))
    : [];

  const stepsFiltered = isOnboardingNeeded ? steps?.filter((_, index) => !onboardingItems?.[index]?.disabled) : [];

  const currentStepImage =
    isOnboardingEnabled && stepsFiltered && !stepsFiltered?.[stepIndex]?.image?.hidden
      ? stepsFiltered?.[stepIndex]?.image?.src
      : null;

  const srcImage = currentStepImage?.includes('base64')
    ? currentStepImage
    : `${process.env.PUBLIC_URL}assets/${currentStepImage}`;

  const hasPrevious = useCallback(() => !!stepIndex, [stepIndex]);

  const hasNext = useCallback(() => {
    return stepIndex < stepsFiltered.length - 1;
  }, [stepIndex]);

  const onEnd = () => {
    setIsOnboardingAlreadyDone(true);
    setStepIndex(0);
    event?.('onboardingCompleted');
    Local.set(Local.names.onboarding, new Date().getTime());
  };

  const onNext = useCallback(() => {
    if (hasNext()) {
      setStepIndex((previous) => previous + 1);
      carouselRef.current?.focus();
    } else {
      onEnd();
    }
  }, [hasNext, onEnd]);

  const onStep = (index) => {
    setStepIndex(index);
  };

  const onPrevious = useCallback(() => {
    setStepIndex(stepIndex - 1);
    carouselRef.current?.focus();
  }, [stepIndex]);

  const props = useMemo(
    () => ({
      carouselRef,
      isOnboardingAlreadyDone,
      hasNext,
      hasPrevious,
      stepIndex,
      onEnd,
      onNext,
      onPrevious,
      onStep,
      srcImage,
      stepsFiltered,
      isOnboardingNeeded,
    }),
    [
      carouselRef,
      isOnboardingAlreadyDone,
      hasNext,
      hasPrevious,
      stepIndex,
      onEnd,
      onNext,
      onPrevious,
      onStep,
      srcImage,
      stepsFiltered,
      isOnboardingNeeded,
    ],
  );

  return <OnboardingContext.Provider value={props}>{children}</OnboardingContext.Provider>;
}
