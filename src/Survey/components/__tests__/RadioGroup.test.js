import '@testing-library/jest-dom';

import RadioGroup from '../Radio';
import { RadioItem } from '../RadioGroup';
import { fireEvent } from '@testing-library/react';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('RadioGroup.js', () => {
  it('Should render RadioGroup and Click to set answer - Checked', async () => {
    const { container } = render(<RadioGroup field={mockFieldClass} />);
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
  });
});

describe('RadioItem', () => {
  it('Should render RadioGroup with field props', async () => {
    const { container } = render(<RadioItem field={mockFieldClass} />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('Should render RadioGroup and Click to set answer - Checked', async () => {
    const onChange = jest.fn();
    const { container } = render(<RadioItem field={mockFieldClass} onChange={onChange} />);
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
  });
});
