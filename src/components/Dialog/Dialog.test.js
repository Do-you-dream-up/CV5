import Dialog from './Dialog';
import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: () => ({
    interactions: [],
    prompt: '',
    setPrompt: jest.fn(),
    isWaitingForResponse: false,
  }),
}));

describe('Dialog Component', () => {
  it('should render without errors', () => {
    render(<Dialog dialogRef={null} open={false} />);
  });

  it('should scroll to the bottom when open is true', () => {
    const querySelectorSpy = jest.spyOn(document, 'querySelector');

    const chatboxDiv = {
      scrollTop: 0,
      scrollHeight: 100,
    };

    querySelectorSpy.mockReturnValue(chatboxDiv);

    render(<Dialog dialogRef={null} open={true} />);

    expect(chatboxDiv.scrollTop).toBe(chatboxDiv.scrollHeight);
  });
  it('should not scroll to the bottom when open is false', () => {
    const querySelectorSpy = jest.spyOn(document, 'querySelector');

    const chatboxDiv = {
      scrollTop: 0,
      scrollHeight: 100,
    };

    querySelectorSpy.mockReturnValue(chatboxDiv);

    render(<Dialog dialogRef={null} open={false} />);

    expect(chatboxDiv.scrollTop).toBe(0);
  });
});
