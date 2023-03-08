import '@testing-library/jest-dom';

import Field from '../../../Survey/Field';
import MultipleChoice from '../MultipleChoice';
import { mockFieldValues } from '../utils';
import { render } from '../../../tools/test-utils';

describe('MultipleChoice.js', () => {
  it('Should render MultipleChoice with field props', async () => {
    const { container } = render(<MultipleChoice field={Field.instanciate({ ...mockFieldValues, type: 'SELECT' })} />);
    expect(container.children[0].querySelector('.question')).toBeInTheDocument();
  });
});
