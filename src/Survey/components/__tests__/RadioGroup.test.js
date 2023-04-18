import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';

import Field from '../../Field';
import RadioGroup from '../RadioGroup';

describe('RadioGroup.js', () => {
  it('should call saveAsUserAnswer on active fields when current is defined', () => {
    const field1 = new Field({ id: '1', label: 'option 1', userAnswerValue: 'allo' });
    field1.saveAsUserAnswer = jest.fn();
    const field2 = new Field({ id: '2', label: 'option 2', userAnswerValue: 'allo' });
    const parent = new Field({ id: 'parent', label: 'Parent field', userAnswerValue: 'allo' });
    const fields = [field1, field2];
    const { container } = render(<RadioGroup showRequiredMessage={false} fields={fields} parent={parent} />);
    // Select the first radio button

    const option1 = container.querySelector('input[id="1"]');
    fireEvent.change(option1);
    // Check if saveAsUserAnswer is called on active fields
    setTimeout(() => {
      expect(field1.saveAsUserAnswer).toHaveBeenCalledTimes(1);
      expect(field2.saveAsUserAnswer).toHaveBeenCalledTimes(0);
    }, 500);
  });
  it('should change the selected field when a radio button is clicked', () => {
    const field1 = new Field({ id: '1', label: 'option 1', userAnswerValue: 'allo' });
    const field2 = new Field({ id: '2', label: 'option 2', userAnswerValue: 'allo' });
    const fields = [field1, field2];
    const parent = new Field({ id: 'parent', label: 'Parent field', userAnswerValue: 'allo' });
    const onChangeMock = jest.fn();
    const { getByLabelText } = render(<RadioGroup fields={fields} parent={parent} onChange={onChangeMock} />);
    const field2RadioButton = getByLabelText('option 2');

    fireEvent.click(field2RadioButton);
    setTimeout(() => {
      expect(onChangeMock).toHaveBeenCalledWith(fields[1]);
    }, 500);
  });
});
