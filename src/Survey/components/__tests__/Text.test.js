import '@testing-library/jest-dom';

import Text from '../Text';
import { fireEvent } from '@testing-library/react';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Text.js', () => {
  it('Should render Text with field props', async () => {
    const { container } = render(<Text field={mockFieldClass} />);
    expect(container.querySelector('.text')).toBeInTheDocument();
    expect(container.querySelector('.question')).toBeInTheDocument();
  });

  it('Should write into Text input', async () => {
    const { container } = render(<Text field={mockFieldClass} />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: '23' } });
    expect(input.value).toBe('23');
  });
});
