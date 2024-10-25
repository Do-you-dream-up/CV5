import QuickreplyTemplate from './';
import { render } from '../../tools/test-utils';

describe('QuickreplyTemplate', () => {
  it('renders null if html is not defined', () => {
    const { container } = render(<QuickreplyTemplate />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null if html is not a valid JSON object', () => {
    const { container } = render(<QuickreplyTemplate html="not a JSON object" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the text content if it exists', () => {
    const { getByText } = render(<QuickreplyTemplate html='{"text": "Hello World"}' />);
    expect(getByText('Hello World')).toBeDefined();
  });

  it('renders the quick reply buttons if they exist', () => {
    const { getByText } = render(
      <QuickreplyTemplate html='{"quick": {"button1": "Button 1", "button2": "Button 2"}}' />,
    );
    expect(getByText('Button 1')).toBeDefined();
    expect(getByText('Button 2')).toBeDefined();
  });
});
