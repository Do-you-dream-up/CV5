import '@testing-library/jest-dom';

import Teaser from './Teaser';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

describe('Teaser', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<Teaser />);
    expect(getByTestId('teaser-chatbot')).toBeInTheDocument();
  });

  it('should handle long press', () => {
    jest.useFakeTimers();
    const { getByRole } = render(<Teaser open />);
    fireEvent.touchStart(getByRole('button'));
    jest.advanceTimersByTime(500);
    expect(getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    fireEvent.touchEnd(getByRole('button'));
  });
});
