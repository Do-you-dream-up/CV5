import { fireEvent, screen } from '@testing-library/react';

import Form from './index';
import { render } from '../../tools/test-utils';

describe('Form', () => {
  const mockOnResolve = jest.fn();
  const mockOnDismiss = jest.fn();
  const mockOnReject = jest.fn();
  const mockChildren = jest.fn().mockReturnValue(<input name="test" />);
  const mockClassName = 'test-class';
  const mockThinking = false;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(
      <Form
        onResolve={mockOnResolve}
        onDismiss={mockOnDismiss}
        onReject={mockOnReject}
        children={mockChildren}
        className={mockClassName}
        thinking={mockThinking}
      />,
    );

    expect(screen.getByTestId('dydu-form')).toBeDefined();
  });

  it('should update state when input value changes', () => {
    render(
      <Form
        onResolve={mockOnResolve}
        onDismiss={mockOnDismiss}
        onReject={mockOnReject}
        children={mockChildren}
        className={mockClassName}
        thinking={mockThinking}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input.value).toBe('test value');
  });

  it('should call onResolve with form data when submitted', () => {
    render(
      <Form
        onResolve={mockOnResolve}
        onDismiss={mockOnDismiss}
        onReject={mockOnReject}
        children={mockChildren}
        className={mockClassName}
        thinking={mockThinking}
      />,
    );

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByTestId('form.submit', { name: 'submit' });

    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(submitButton);

    expect(mockOnResolve).toHaveBeenCalledWith({ space: 'default' });
  });
});
