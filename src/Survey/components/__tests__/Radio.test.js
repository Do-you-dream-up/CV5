import '@testing-library/jest-dom';

import Radio from '../Radio';
import { fireEvent } from '@testing-library/react';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Radio.js', () => {
  it('Should render Radio with field props', async () => {
    const { container } = render(<Radio field={mockFieldClass} />);
    expect(container.querySelector('.radio')).toBeInTheDocument();
  });

  it('Should render Radio and Click to set answer - Checked', async () => {
    const { container } = render(<Radio field={mockFieldClass} />);
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
  });
});
