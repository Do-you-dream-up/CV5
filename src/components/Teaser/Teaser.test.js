import '@testing-library/jest-dom';

import Teaser from './Teaser';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

describe('Teaser', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<Teaser id={'dydu-teaser'} />);
    expect(getByTestId('dydu-teaser')).toBeInTheDocument();
  });

  it('should handle long press', () => {
    jest.useFakeTimers();
    const { getByRole } = render(<Teaser id={'dydu-teaser'} open />);
    fireEvent.touchStart(getByRole('button'));
    jest.advanceTimersByTime(500);
    fireEvent.touchEnd(getByRole('button'));
  });
});
