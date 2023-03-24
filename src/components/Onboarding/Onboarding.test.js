import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';

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
xdescribe('Onboarding component', () => {
  test('renders children if onboarding is not enabled or active', () => {
    render(
      <Onboarding>
        <div>Children</div>
      </Onboarding>,
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  test('renders nothing if not ready or not rendering or not active', () => {
    const { container } = render(
      <Onboarding render={false}>
        <div>Children</div>
      </Onboarding>,
    );
    const classBody = container.querySelector('dydu-onboarding');
    expect(classBody).toBeNull();
  });

  test('renders onboarding steps if ready and rendering and active', async () => {
    const newConfig = new ConfigurationFixture();
    newConfig.enableOnboarding();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useOnboarding.mockReturnValue({
      active: true,
      index: 1,
      hasNext: true,
      hasPrevious: true,
      onEnd: jest.fn(),
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onStep: jest.fn(),
    });
    useTranslation.mockReturnValue({
      ready: true,
      t: jest.fn().mockReturnValue([
        { title: '', body: '' },
        { title: '', body: '' },
      ]),
    });
    const { container } = render(
      <Onboarding render={true}>
        <div>Children</div>
      </Onboarding>,
    );

    await waitFor(() => {
      expect(container.querySelector('dydu-onboarding')).toBeInTheDocument();
    });

    expect(screen.getByText('Skip')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
