import '@testing-library/jest-dom';

import React from 'react';
import Select from '../Select';
import { mockFieldClass } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Select.js', () => {
  it('Should render Select with field props', async () => {
    const { container } = render(<Select field={mockFieldClass} />);
    expect(container.querySelector('select')).toBeInTheDocument();
    expect(container.querySelector('.slaves')).toBeInTheDocument();
  });
});
