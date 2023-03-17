import '@testing-library/jest-dom';

import ContactsList from './index';
import { render } from '@testing-library/react';
import { useConfiguration } from '../../contexts/ConfigurationContext';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));
describe('ContactsList', () => {
  const mockConfiguration = {
    contacts: {
      email: true,
    },
  };

  it('should render ContactsList component', () => {
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    const screen = render(<ContactsList data-testid="contactListId" />);
    screen.findByText('contactListId').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should render ContactsList with list ', () => {
    const list = [
      {
        title: 'Une question? Une réclamation?',
        email: 'support@chatbot.com',
      },
    ];
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    const screen = render(<ContactsList list={list} />);
    screen.findByText('open_in_new').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it("should render ContactsList component with email's list ", () => {
    const list = [
      {
        title: 'Une question? Une réclamation?',
        email: 'support@chatbot.com',
      },
    ];
    const id = 'email';
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    const screen = render(<ContactsList list={list} id={id} />);
    screen.findByText('support@chatbot.com').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it("should render ContactsList component with phone's list ", () => {
    const list = [
      {
        title: 'Support Commercial',
        phone: '08.00.50.00.94',
      },
      {
        title: 'Support Clientèle',
        phone: '02.78.49.06.28',
      },
    ];
    const id = 'phone';
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    const screen = render(<ContactsList list={list} id={id} />);
    screen.findByText('08.00.50.00.94').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it("should render ContactsList component with social's list ", () => {
    const list = [
      {
        title: 'Linkedin',
        socialText: 'linkedin.com/company/dydu/',
        socialUrl: 'https://www.linkedin.com/company/dydu/',
      },
    ];
    const id = 'social';
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    const screen = render(<ContactsList list={list} id={id} />);
    screen.findByText('linkedin.com/company/dydu/').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });
});
