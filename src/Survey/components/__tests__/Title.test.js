import '@testing-library/jest-dom';

import Title from '../Title';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Title.js', () => {
  it('Should render Title with no field prop', async () => {
    const { container } = render(<Title />);
    expect(container.children[0]).toHaveClass('title');
  });

  it('Should render Title with field props', async () => {
    const { container } = render(<Title field={mockFieldClass} />);
    expect(container.children[0]).toHaveClass('title');
  });
});
