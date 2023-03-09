import '@testing-library/jest-dom';

import Button from './Button';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

jest.mock('../../contexts/UserActionContext', () => ({
  useUserAction: () => ({ tabbing: true }),
}));
describe('Button.tsx', () => {
  const defaultProps = {
    children: 'je suis le bouton',
    onClick: jest.fn(),
  };
  it('should render a button with text', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('je suis le bouton')).toBeInTheDocument();
  });

  it('should call the onClick handler when clicked', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    fireEvent.click(getByText('je suis le bouton'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should render a link button with an href', () => {
    const { getByRole } = render(<Button {...defaultProps} href="https://www.google.com" />);
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com');
  });

  it('should have attribute type submit', () => {
    const { getByRole } = render(<Button type="submit" />);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should render data testId `custom-button`', () => {
    const { getByTestId } = render(<Button component="div" data-testid="custom-button" />);
    expect(getByTestId('custom-button')).toBeInTheDocument();
  });

  it('should disable the button when `disabled` prop is true', () => {
    const { getByRole } = render(<Button disabled />);
    expect(getByRole('button')).toBeDisabled();
  });

  it('should render the `dydu-button-icon` class when `variant` prop is `icon`', () => {
    const { container } = render(<Button variant="icon" />);
    expect(container.firstChild).toHaveClass('dydu-button-icon');
  });

  it('should render className button-icon when icon is defined', () => {
    const href = undefined;
    const { container } = render(
      <Button href={href} icon="icon-chatbox_reduire" variant="icon">
        Click me
      </Button>,
    );
    const element = container.querySelector('button-icon');

    expect(element).toBeDefined();
  });
});
