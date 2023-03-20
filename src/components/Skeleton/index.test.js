import Skeleton from './';
import { render } from '../../tools/test-utils';

describe('Skeleton', () => {
  it('renders a SkeletonText component by default', () => {
    const { getByTestId } = render(<Skeleton />);
    expect(getByTestId('skeleton-text')).toBeDefined();
  });

  it('renders a SkeletonCircle component when variant is "circle"', () => {
    const { getByTestId } = render(<Skeleton variant="circle" />);
    expect(getByTestId('skeleton-circle')).toBeDefined();
  });

  it('renders a SkeletonParagraph component when variant is "paragraph"', () => {
    const { getByTestId } = render(<Skeleton variant="paragraph" />);
    expect(getByTestId('skeleton-paragraph')).toBeDefined();
  });

  it('renders a SkeletonRectangle component when variant is "rectangle"', () => {
    const { getByTestId } = render(<Skeleton variant="rectangle" />);
    expect(getByTestId('skeleton-rectangle')).toBeDefined();
  });

  it('renders children when hide is false', () => {
    const { getByText } = render(<Skeleton hide={false}>Hello World</Skeleton>);
    expect(getByText('Hello World')).toBeDefined();
  });
});
