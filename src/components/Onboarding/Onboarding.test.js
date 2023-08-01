import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { ConfigurationFixture } from '../../test/fixtures/configuration';
import Onboarding from './Onboarding';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useTranslation } from 'react-i18next';

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

jest.mock('../../contexts/OnboardingContext', () => ({
  useOnboarding: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../tools/storage');
describe('Onboarding component', () => {
  test('renders children if onboarding is not enabled or active', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useOnboarding.mockReturnValue({
      isOnboardingAlreadyDone: false,
      stepIndex: 1,
      hasNext: true,
      hasPrevious: true,
      onEnd: jest.fn(),
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onStep: jest.fn(),
    });
    useTranslation.mockReturnValue({
      ready: true,
      t: jest.fn().mockImplementation((target) => {
        if (target === 'onboarding.steps')
          return [
            { title: '', body: '' },
            { title: '', body: '' },
          ];
        else return '';
      }),
    });
    render(
      <Onboarding>
        <div>Children</div>
      </Onboarding>,
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  test('renders nothing if not ready or not rendering or not active', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const { container } = render(
      <Onboarding>
        <div>Children</div>
      </Onboarding>,
    );
    const classBody = container.querySelector('dydu-onboarding');
    expect(classBody).toBeNull();
  });

  test('renders onboarding steps if ready and rendering and active', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.enableOnboarding();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useOnboarding.mockReturnValue({
      isOnboardingAlreadyDone: true,
      stepIndex: 1,
      hasNext: true,
      hasPrevious: true,
      onEnd: jest.fn(),
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onStep: jest.fn(),
    });
    useTranslation.mockReturnValue({
      ready: true,
      t: jest.fn().mockImplementation((target) => {
        if (target === 'onboarding.steps')
          return [
            { title: '', body: '' },
            { title: '', body: '' },
          ];
        else return '';
      }),
    });
    const screen = render(
      <Onboarding>
        <div>Children</div>
      </Onboarding>,
    );

    screen.findByText('dydu-onboarding').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
    screen.findByText('Skip').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
    screen.findByText('Previous').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
    screen.findByText('Next').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should call onStep method on click on step ', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.enableOnboarding();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useOnboarding.mockReturnValue({
      isOnboardingAlreadyDone: false,
      stepIndex: 1,
      hasNext: true,
      hasPrevious: true,
      onEnd: jest.fn(),
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onStep: jest.fn(),
      carouselRef: { current: null },
      stepsFiltered: [
        {
          body: '<p><strong>Préférez des phrases complètes</strong></p><p>Cela facilite ma réflexion et me permet de vous apporter des réponses plus précises.</p>',
          title: 'Quelques astuces',
          image: {
            src: 'dydu-onboarding-1.svg',
            hidden: false,
          },
        },
        {
          body: '<p>Vestibulum maximus libero non lectus porttitor blandit. Suspendisse auctor lobortis orci id volutpat. Vestibulum ante.</p>',
          title: 'Astuces 3',
          image: {
            src: 'dydu-onboarding-3.svg',
            hidden: false,
          },
        },
      ],
      srcImage: '',
      isOnboardingNeeded: true,
    });

    const { getByTestId } = render(<Onboarding />);
    const previousButton = getByTestId('previous');
    expect(previousButton).toBeInTheDocument();
    fireEvent.click(previousButton);
    expect(useOnboarding().onPrevious).toHaveBeenCalled();
  });

  it('should return null if should is false', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.enableOnboarding();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useOnboarding.mockReturnValue({
      isOnboardingAlreadyDone: true,
      stepIndex: 1,
      hasNext: true,
      hasPrevious: true,
      onEnd: jest.fn(),
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onStep: jest.fn(),
    });
    useTranslation.mockReturnValue({
      ready: false,
      t: jest.fn().mockImplementation((target) => {
        if (target === 'onboarding.steps')
          return [
            { title: '', body: '' },
            { title: '', body: '' },
          ];
        else return '';
      }),
    });
    render(
      <Onboarding>
        <div>Children</div>
      </Onboarding>,
    );

    screen.findByText('dydu-onboarding').then((nodeElement) => expect(nodeElement).not.toBeInTheDocument());
  });
});
