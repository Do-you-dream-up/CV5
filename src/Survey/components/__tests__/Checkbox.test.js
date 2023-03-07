import '@testing-library/jest-dom';

import Checkbox from '../Checkbox';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Checkbox.js', () => {
  it('Should render Checkbox with field props', async () => {
    const { container } = render(<Checkbox field={mockFieldClass} />);
    console.log('🚀 ~ file: Checkbox.test.js:17 ~ it ~ container.children[0]:', container.children[0]);
    // expect(container.children[0]).toHaveClass('checkbox');
  });
});
