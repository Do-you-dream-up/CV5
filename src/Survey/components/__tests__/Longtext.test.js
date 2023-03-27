import '@testing-library/jest-dom';

import LongText from '../LongText';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Longtext.js', () => {
  it('Should render Longtext with field props', async () => {
    const { container } = render(<LongText field={mockFieldClass} />);
    expect(container.children[0].querySelector('.long-text')).toBeInTheDocument();
  });
});
