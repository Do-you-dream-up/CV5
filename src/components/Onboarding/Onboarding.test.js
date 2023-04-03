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
      active: false,
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
      <Onboarding render={false}>
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
      <Onboarding render={true}>
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
      t: jest.fn().mockImplementation((target) => {
        if (target === 'onboarding.steps')
          return [
            { title: '', body: '' },
            { title: '', body: '' },
          ];
        else return '';
      }),
    });
    const { getByTestId } = render(
      <Onboarding render={true}>
        <div>Children</div>
      </Onboarding>,
    );
    const stepButton = getByTestId('testid-0');
    fireEvent.click(stepButton);
    expect(useOnboarding().onStep).toHaveBeenCalled();
    const previousButton = getByTestId('previous');
    fireEvent.click(previousButton);
    expect(useOnboarding().onPrevious).toHaveBeenCalled();
  });

  it('should return null if should is false', () => {
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
      <Onboarding render={true}>
        <div>Children</div>
      </Onboarding>,
    );

    screen.findByText('dydu-onboarding').then((nodeElement) => expect(nodeElement).not.toBeInTheDocument());
  });
});
