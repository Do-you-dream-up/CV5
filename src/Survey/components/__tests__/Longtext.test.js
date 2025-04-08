import '@testing-library/jest-dom';

import LongText from '../LongText';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('LongText.tsx', () => {
  it('Should render LongText with field props', () => {
    const { container } = render(<LongText field={mockFieldClass} />);
    expect(container.querySelector('.long-text')).toBeInTheDocument();
  });
});
