import { fireEvent, render, screen } from '@testing-library/react';

import SurveyForm from '../../SurveyForm';
import { useSurvey } from '../../SurveyProvider';

jest.mock('../../SurveyProvider', () => ({
  useSurvey: jest.fn(),
}));

describe('SurveyForm', () => {
  test('renders a form with fields and a submit button if instances are defined', () => {
    const mockInstance1 = {
      render: jest.fn(() => <input type="text" name="field1" data-testid="field1" />),
    };
    const mockInstance2 = {
      render: jest.fn(() => <input type="text" name="field2" data-testid="field2" />),
    };

    useSurvey.mockReturnValue({
      instances: [mockInstance1, mockInstance2],
      getSurvey: jest.fn(),
      onSubmit: jest.fn(),
    });

    render(<SurveyForm />);

    expect(screen.queryByRole('button', { name: 'click' })).toBe(null);

    const field1 = screen.getByTestId('field1');
    const field2 = screen.getByTestId('field2');
    expect(field1).toBeDefined();
    expect(field2).toBeDefined();

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    expect(useSurvey().onSubmit).toHaveBeenCalledTimes(1);
  });
});
