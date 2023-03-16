import '@testing-library/jest-dom';

import { act, renderHook } from '@testing-library/react-hooks';

import useMessageFieldRequired from '../hooks/useMessageFieldRequired';

const fakeField = {
  isShowingRequiredMessage: jest.fn(),
  turnOnShowingRequiredMessage: jest.fn(),
  turnOffShowingRequiredMessage: jest.fn(),
  setUiCallbackShowRequiredMessage: jest.fn(),
  setUiCallbackHideRequiredMessage: jest.fn(),
};

describe('useMessageFieldRequired', () => {
  it('sets the initial message if the showRequiredMessage flag is passed', () => {
    const { result } = renderHook(() => useMessageFieldRequired(fakeField, true));
    expect(result.current.message).toEqual('Ce champs est requis');
  });

  it('does not set the initial message if the showRequiredMessage flag is not passed', () => {
    const { result } = renderHook(() => useMessageFieldRequired(fakeField));
    expect(result.current.message).toBeNull();
  });

  it('sets the message when show is true', () => {
    const { result } = renderHook(() => useMessageFieldRequired(fakeField));
    act(() => {
      result.current.showMessage();
    });
    expect(result.current.message).toEqual('Ce champs est requis');
  });

  it('unsets the message when show is false', () => {
    const { result } = renderHook(() => useMessageFieldRequired(fakeField, true));
    act(() => {
      result.current.hideMessage();
    });
    expect(result.current.message).toBeNull();
  });

  it('sets the UI callbacks for showing and hiding the message', () => {
    renderHook(() => useMessageFieldRequired(fakeField));
    expect(fakeField.setUiCallbackShowRequiredMessage).toHaveBeenCalled();
    expect(fakeField.setUiCallbackHideRequiredMessage).toHaveBeenCalled();
  });
});
