import { fireEvent, render } from '@testing-library/react';

import ModalClose from './';

describe('ModalClose', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<ModalClose onResolve={() => {}} />);
    const modalClose = getByTestId('modal-close');
    expect(modalClose).toBeDefined();
  });

  it('calls onResolve when "Yes" button is clicked', () => {
    const onResolveMock = jest.fn();
    const { getByText } = render(<ModalClose onResolve={onResolveMock} />);
    const yesButton = getByText('close.yes');
    fireEvent.click(yesButton);
    expect(onResolveMock).toHaveBeenCalled();
  });

  it('calls onReject when "No" button is clicked', () => {
    const onRejectMock = jest.fn();
    const { getByText } = render(<ModalClose onResolve={() => {}} onReject={onRejectMock} />);
    const noButton = getByText('close.no');
    fireEvent.click(noButton);
    expect(onRejectMock).toHaveBeenCalled();
  });
});
