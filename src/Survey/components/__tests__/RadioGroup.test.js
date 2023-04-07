import '@testing-library/jest-dom';

import { childrenRadio, mockFieldValues } from '../utils';

import Field from '../../../Survey/Field';
import RadioGroup from '../Radio';
import { RadioItem } from '../RadioGroup';
import { fireEvent } from '@testing-library/react';
import { render } from '../../../tools/test-utils';

describe('RadioGroup.js', () => {
  it('Should render RadioGroup and Click to set answer - Checked', async () => {
    const { container } = render(
      <RadioGroup field={Field.instanciate({ ...mockFieldValues, children: [childrenRadio], type: 'RADIO' })} />,
    );
    const checkbox = container.querySelector('input');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toEqual(true);
  });
});

describe('RadioItem', () => {
  it('Should render RadioGroup with field props', async () => {
    const { container } = render(
      <RadioItem field={Field.instanciate({ ...mockFieldValues, children: [childrenRadio], type: 'RADIO' })} />,
    );
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('Should render RadioGroup and Click to set answer - Checked', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <RadioItem
        field={Field.instanciate({ ...mockFieldValues, children: [childrenRadio], type: 'RADIO' })}
        onChange={onChange}
      />,
    );
    const checkbox = container.querySelector('input');
    console.log('🚀 ~ file: RadioGroup.test.js:39 ~ it ~ checkbox:', checkbox);
    fireEvent.change(checkbox, { target: { value: '1' } });
  });
});
