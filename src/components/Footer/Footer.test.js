import Footer from './';
import { render } from '../../tools/test-utils';

describe('Footer', () => {
  const mockOnRequest = jest.fn();
  const mockOnResponse = jest.fn();

  beforeEach(() => {
    mockOnRequest.mockClear();
    mockOnResponse.mockClear();
  });

  it('renders the Footer component', () => {
    const { container } = render(<Footer onRequest={mockOnRequest} onResponse={mockOnResponse} />);
    expect(container.firstChild).toBeDefined();
  });
});
