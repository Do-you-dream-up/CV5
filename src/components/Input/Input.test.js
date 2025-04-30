import '@testing-library/jest-dom';

import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { ConfigurationFixture } from '../../test/fixtures/configuration';
import Input from './Input';
import { useConfiguration } from '../../contexts/ConfigurationContext';

jest.mock('../../tools/axios', () => ({
  emit: jest.fn().mockReturnValue(Promise.resolve()),
  SERVLET_API: {
    get: jest.fn(),
  },
  setCallOidcLogin: jest.fn(),
}));

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest
    .fn()
    .mockReturnValue({ disabled: false, locked: false, placeholder: '', autoSuggestionActive: true, prompt: '' }),
}));

describe('Input', () => {
  it('should call onChange handler when user types in input field', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const onChange = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={jest.fn()} onResponse={jest.fn()} focus={jest.fn()} id="test-input" />);
    });
    const inputField = screen.getByTestId('textareaId');
    fireEvent.change(inputField, { target: { value: 'Jianni' } });
    screen.debug();
    waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it('should prevent default event behavior and call submit when Enter is pressed', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const submit = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={submit} />);
    });
    const input = screen.getByTestId('textareaId');
    const enter = { keyCode: 13, defaultPrevented: false, preventDefault: jest.fn() };

    fireEvent.keyDown(input, enter);

    waitFor(() => expect(enter.preventDefault).toHaveBeenCalled());
    waitFor(() => expect(submit).toHaveBeenCalledWith(''));
  });
  test('calls sendInput with input text when submitted', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.setMaxLength();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const sendInputMock = jest.fn();
    const onRequestMock = jest.fn();
    const onResponseMock = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={onRequestMock} onResponse={onResponseMock} />);
    });

    const input = screen.getByTestId('textareaId');
    fireEvent.change(input, { target: { value: 'Hello' } });
    const submitButton = screen.getByTestId('dydu-submit-footer');
    fireEvent.click(submitButton);
    waitFor(() => expect(sendInputMock).toHaveBeenCalledTimes(1));
    waitFor(() => expect(sendInputMock).toHaveBeenCalledWith('Hello'));
    waitFor(() => expect(onRequestMock).toHaveBeenCalledTimes(1));
    waitFor(() => expect(onResponseMock).not.toHaveBeenCalled());
  });
  test('should clean input to protect against xss', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const onRequest = jest.fn();
    const onResponse = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={onRequest} onResponse={onResponse} />);
    });

    const input = screen.getByTestId('textareaId');
    fireEvent.change(input, { target: { value: '<script>alert("XSS")</script>' } });
    const submitButton = screen.getByTestId('dydu-submit-footer');
    fireEvent.click(submitButton);
    expect(onRequest).not.toHaveBeenCalled();
  });
  test('should clean input to protect against xss and send request safe', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const onRequest = jest.fn();
    const onResponse = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={onRequest} onResponse={onResponse} />);
    });

    const input = screen.getByTestId('textareaId');
    fireEvent.change(input, { target: { value: '<script>alert("XSS")</script>clean input' } });
    const submitButton = screen.getByTestId('dydu-submit-footer');
    fireEvent.click(submitButton);
    expect(onRequest).toHaveBeenCalledWith('clean input');
  });
  test('should clean input to protect against xss with dom node', () => {
    const newConfig = new ConfigurationFixture();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const onRequest = jest.fn();
    const onResponse = jest.fn();
    let screen;
    act(() => {
      screen = render(<Input onRequest={onRequest} onResponse={onResponse} />);
    });

    const input = screen.getByTestId('textareaId');
    fireEvent.change(input, { target: { value: '<b onclick="console.log(\'XSS found\')">' } });
    const submitButton = screen.getByTestId('dydu-submit-footer');
    fireEvent.click(submitButton);
    expect(onRequest).not.toHaveBeenCalled();
  });
});
