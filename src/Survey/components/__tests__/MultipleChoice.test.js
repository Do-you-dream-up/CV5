import '@testing-library/jest-dom';

import MultipleChoice from '../MultipleChoice';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('MultipleChoice.js', () => {
  it('Should render MultipleChoice with field props', async () => {
    const { container } = render(<MultipleChoice field={mockFieldClass} />);
    expect(container.children[0].querySelector('.question')).toBeInTheDocument();
  });
});
