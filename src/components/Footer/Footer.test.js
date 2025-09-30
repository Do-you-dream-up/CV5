import Footer from './Footer';
import { render } from '../../tools/test-utils';
import { DialogContext } from '../../contexts/DialogContext';

describe('Footer', () => {
  const mockOnRequest = jest.fn();
  const mockOnResponse = jest.fn();

  const mockSetVoiceContent = jest.fn();

  const mockDialogContextValue = {
    setVoiceContent: mockSetVoiceContent,
    voiceContent: null,
    setLocked: jest.fn(),
    locked: false,
  };

  function MockDialogProvider({ children }) {
    return <DialogContext.Provider value={mockDialogContextValue}>{children}</DialogContext.Provider>;
  }

  beforeEach(() => {
    mockOnRequest.mockClear();
    mockOnResponse.mockClear();
  });

  it('renders the Footer component', () => {
    const { container } = render(
      <MockDialogProvider>
        {' '}
        <Footer onRequest={mockOnRequest} onResponse={mockOnResponse} />{' '}
      </MockDialogProvider>,
    );
    expect(container.firstChild).toBeDefined();
  });
});
