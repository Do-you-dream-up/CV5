import QuickreplyTemplate from './';
import { render } from '../../tools/test-utils';
import { sortQuickReply } from '../../tools/helpers';

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
    const { getByText } = render(<QuickreplyTemplate html='{"quick": {"button1": "Hello World"}}' />);
    expect(getByText('Hello World')).toBeDefined();
  });

  it('renders the quick reply buttons if they exist', () => {
    const { getByText } = render(
      <QuickreplyTemplate html='{"quick": {"button1": "Button 1", "button2": "Button 2"}}' />,
    );
    expect(getByText('Button 1')).toBeDefined();
    expect(getByText('Button 2')).toBeDefined();
  });
  it(' if quick is empty, sortQuickReply should return an empty object', () => {
    const contentQuick = {};
    const sorted = sortQuickReply(contentQuick);
    expect(sorted).toEqual({});
  });
  it(' if quick is null, sortQuickReply should return null', () => {
    const contentQuick = null;
    const sorted = sortQuickReply(contentQuick);
    expect(sorted).toBeNull();
  });
  it(' if quick is undefined, sortQuickReply should return undefined', () => {
    const contentQuick = undefined;
    const sorted = sortQuickReply(contentQuick);
    expect(sorted).toBeUndefined();
  });
});
