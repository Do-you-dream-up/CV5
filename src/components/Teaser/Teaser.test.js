import '@testing-library/jest-dom';

import Teaser from './Teaser';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';
import { DialogContext } from '../../contexts/DialogContext';

describe('Teaser', () => {
  const mockSetVoiceContent = jest.fn();

  const mockDialogContextValue = {
    setVoiceContent: mockSetVoiceContent,
    voiceContent: null,
    setLocked: jest.fn(),
    locked: false,
  };

  function MockDialogProvider({ children }) {
    return <DialogContext.Provider value={mockDialogContextValue}>{children}</DialogContext.Provider>;
  }
  it('renders the component', () => {
    const { getByTestId } = render(
      <MockDialogProvider>
        <Teaser id={'dydu-teaser'} open />
      </MockDialogProvider>,
    );
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
