import ModalFooterMenu from './';
import dydu from '../../tools/dydu';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

jest.mock('../../contexts/UserActionContext', () => ({
  useUserAction: () => ({ tabbing: true }),
}));
describe('ModalFooterMenu', () => {
  const onResolveMock = jest.fn();

  window.dydu = {
    promptEmail: {
      prompt: jest.fn(),
    },
    space: {
      prompt: jest.fn(),
    },
    printHistory: jest.fn(),
    getSpace: jest.fn().mockReturnValue('Space Name'),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with a list of items', () => {
    const { getByText } = render(<ModalFooterMenu onResolve={onResolveMock} />, {
      configuration: {
        moreOptions: {
          exportConversation: true,
          printConversation: true,
          sendGdprData: true,
        },
        spaces: {
          items: ['space1', 'space2'],
        },
      },
    });

    expect(getByText('footer.menu.close')).toBeDefined();
    expect(getByText('footer.menu.email')).toBeDefined();
    expect(getByText('footer.menu.print')).toBeDefined();
    expect(getByText('footer.menu.gdpr')).toBeDefined();
    expect(getByText('footer.menu.spaces')).toBeDefined();
  });

  it('calls the onResolve function when clicking on the Close button', () => {
    const { getByText } = render(<ModalFooterMenu onResolve={onResolveMock} />);
    const closeButton = getByText('footer.menu.close');

    fireEvent.click(closeButton);

    expect(onResolveMock).toHaveBeenCalledTimes(1);
  });

  it('calls the printConversation function when clicking on the Print conversation button', () => {
    const { getByText } = render(<ModalFooterMenu onResolve={onResolveMock} />, {
      configuration: {
        moreOptions: {
          printConversation: true,
        },
      },
    });
    const printButton = getByText('footer.menu.print');

    fireEvent.click(printButton);
  });

  it('calls the promptEmail function with the correct argument when clicking on the Export conversation by email button', () => {
    const { getByText } = render(<ModalFooterMenu onResolve={onResolveMock} />);
    const emailButton = getByText('footer.menu.email');

    fireEvent.click(emailButton);

    expect(window.dydu.promptEmail.prompt).toHaveBeenCalledTimes(1);
    expect(window.dydu.promptEmail.prompt).toHaveBeenCalledWith('exportConv');
  });

  it('calls the promptEmail function with the correct argument when clicking on the GDPR consent button', () => {
    const { getByText } = render(<ModalFooterMenu onResolve={onResolveMock} />);
    const gdprButton = getByText('footer.menu.gdpr');

    fireEvent.click(gdprButton);

    expect(window.dydu.promptEmail.prompt).toHaveBeenCalledTimes(1);
    expect(window.dydu.promptEmail.prompt).toHaveBeenCalledWith('gdpr');
  });
});
