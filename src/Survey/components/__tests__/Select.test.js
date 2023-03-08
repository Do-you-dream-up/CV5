import '@testing-library/jest-dom';

import Field from '../../../Survey/Field';
import React from 'react';
import Select from '../Select';
import { fireEvent } from '@testing-library/react';
import { mockFieldValues } from '../utils';
import { render } from '../../../tools/test-utils';

describe('Select.js', () => {
  it('Should render Select with field props', async () => {
    const { container } = render(<Select field={Field.instanciate({ ...mockFieldValues, type: 'SELECT' })} />);
    expect(container.querySelector('select')).toBeInTheDocument();
    expect(container.querySelector('.slaves')).toBeInTheDocument();
  });

  it('Should render Select with field props', async () => {
    const { container } = render(<Select field={Field.instanciate({ ...mockFieldValues, type: 'SELECT' })} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
  });
});
