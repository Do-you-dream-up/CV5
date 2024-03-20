import { DialogProvider } from '../../../contexts/DialogContext';
import Voice from '../';
import { render } from '../../../tools/test-utils';

jest.mock('../../../tools/axios', () => ({
  emit: jest.fn().mockReturnValue(Promise.resolve()),
  SERVLET_API: {
    get: jest.fn(),
  },
  setCallOidcLogin: jest.fn(),
}));

describe('Voice component', () => {
  jest.mock('socket.io-client', () => ({
    connect: jest.fn(() => ({
      on: jest.fn(),
      emit: jest.fn(),
    })),
  }));
  it('renders without crashing', () => {
    const { queryByTestId } = render(
      <DialogProvider>
        <Voice show={true} />
      </DialogProvider>,
    );
    expect(queryByTestId('dydu-voice-actions')).toBeDefined();
  });

  it('shows start recording button', () => {
    const { getAllByTitle } = render(
      <DialogProvider>
        <Voice show={true} />
      </DialogProvider>,
    );
    expect(getAllByTitle('input.actions.record.start')).toBeDefined();
  });
});
