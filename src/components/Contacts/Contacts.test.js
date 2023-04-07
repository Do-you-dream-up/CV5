import '@testing-library/jest-dom';

import Contacts from './index';
import { render } from '@testing-library/react';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));
describe('Contacts', () => {
  it('should render ContactsList component', () => {
    const mockConfiguration = {
      contacts: {
        socialNetwork: true,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);
    screen.findByText('dydu-contact-social').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should render ContactsList component', () => {
    const mockConfiguration = {
      contacts: {
        socialNetwork: false,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);

    screen.findByText('dydu-contact-social').then((nodeElement) => expect(nodeElement).toBeNull());
  });

  it('should render ContactsList component with `phone` id', () => {
    const mockConfiguration = {
      contacts: {
        phone: true,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);

    screen.findByText('phone').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should NOT render ContactsList component with `phone` id', () => {
    const mockConfiguration = {
      contacts: {
        phone: false,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);
    screen.findByText('phone').then((nodeElement) => expect(nodeElement).toBeNull());
  });

  it('should render ContactsList component with `email` id', () => {
    const mockConfiguration = {
      contacts: {
        email: true,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);

    screen.findByText('email').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should NOT render ContactsList component with `email` id', () => {
    const mockConfiguration = {
      contacts: {
        email: false,
      },
    };
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useTranslation.mockReturnValue({ ready: true, t: jest.fn() });
    const screen = render(<Contacts />);
    screen.findByText('email').then((nodeElement) => expect(nodeElement).toBeNull());
  });
});
