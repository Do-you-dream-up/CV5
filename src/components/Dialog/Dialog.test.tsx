import Dialog from './Dialog';
import { render } from '@testing-library/react';
import { useShadow } from '../../contexts/ShadowProvider';

jest.mock('../../contexts/ShadowProvider');

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: () => ({
    interactions: [],
    prompt: '',
    setPrompt: jest.fn(),
    isWaitingForResponse: false,
  }),
}));

describe('Dialog Component', () => {
  const mockDiv = document.createElement('div');
  document.body.appendChild(mockDiv);

  const targetDiv = document.createElement('div');
  targetDiv.className = 'dydu-chatbox-body';
  targetDiv.scrollTop = 0;
  mockDiv.appendChild(targetDiv);

  useShadow.mockReturnValue({
    shadowAnchor: mockDiv,
  });

  it('should render Dialog component', () => {
    render(<Dialog dialogRef={null} open={false} />);

    expect(targetDiv.scrollTop).toBe(0);
  });

  it('should scroll to the bottom when open is true', () => {
    const { debug } = render(<Dialog dialogRef={null} open={true} />);
    debug();

    expect(targetDiv.scrollTop).toBe(targetDiv.scrollHeight);
  });
  it('should not scroll to the bottom when open is false', () => {
    render(<Dialog dialogRef={null} open={false} />);

    expect(targetDiv.scrollTop).toBe(0);
  });
});
