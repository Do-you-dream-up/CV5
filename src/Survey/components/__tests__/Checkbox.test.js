import '@testing-library/jest-dom';

import Checkbox from '../Checkbox';
import { fireEvent } from '@testing-library/react';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Checkbox.tsx', () => {
  it('Should render Checkbox with field props', async () => {
    const { container } = render(<Checkbox field={mockFieldClass} />);
    expect(container.querySelector('.checkbox')).toBeInTheDocument();
  });

  it('Should render Checkbox and Click to set answer - Checked', async () => {
    const { container } = render(<Checkbox field={mockFieldClass} />);
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    expect(container.querySelector('.checkbox')).toBeInTheDocument();
  });

  it('Should render Checkbox and Click to set and unset answer - Checked', async () => {
    const { container } = render(<Checkbox field={mockFieldClass} />);
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(container.querySelector('.checkbox')).toBeInTheDocument();
  });
});
