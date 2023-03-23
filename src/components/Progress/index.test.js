import Progress from './';
import { render } from '../../tools/test-utils';

describe('Progress', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Progress />);
    expect(getByTestId('progress')).toBeDefined();
  });

  it('renders with custom className', () => {
    const { container } = render(<Progress className="custom-class" />);
    expect(container.getElementsByClassName('custom-class').length).toBe(1);
  });
});
