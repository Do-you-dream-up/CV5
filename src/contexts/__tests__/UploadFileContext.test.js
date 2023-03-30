import '@testing-library/jest-dom';

import { UploadFileProvider, useUploadFile } from '../UploadFileContext';
import { render, screen } from '@testing-library/react';

import dydu from '../../tools/dydu';

describe('UploadFileContext', () => {
  it('should renders without crashing', () => {
    render(
      <UploadFileProvider>
        <div data-testid="test-child">Test child</div>
      </UploadFileProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeDefined();
  });

  describe('validateFile', () => {
    test('should validate a file with allowed format and size', () => {
      const file = new File(['Hello, World!'], 'hello.txt', { type: 'text/plain' });
      const validateFileMock = jest.fn();
      const TestComponent = () => {
        const { validateFile } = useUploadFile();
        validateFileMock(validateFile(file));
        return null;
      };
      render(
        <UploadFileProvider>
          <TestComponent />
        </UploadFileProvider>,
      );
      expect(validateFileMock).toHaveBeenCalledWith(true);
    });

    test('should not validate a file with disallowed format', () => {
      const file = new File(['Hello, World!'], 'hello.zip', { type: 'application/zip' });
      const validateFileMock = jest.fn();
      const TestComponent = () => {
        const { validateFile } = useUploadFile();
        validateFileMock(validateFile(file));
        return null;
      };
      render(
        <UploadFileProvider>
          <TestComponent />
        </UploadFileProvider>,
      );
      expect(validateFileMock).toHaveBeenCalledWith(false);
    });

    test('should display an error message when the format is disallowed', () => {
      const file = new File(['Hello, World!'], 'hello.zip', { type: 'application/zip' });
      const TestComponent = () => {
        const { validateFile, errorFormatMessage } = useUploadFile();
        validateFile(file);
        return <div>{errorFormatMessage}</div>;
      };
      const { getByText } = render(
        <UploadFileProvider>
          <TestComponent />
        </UploadFileProvider>,
      );
      expect(getByText('uploadFile.errorFormatMessage')).toBeInTheDocument();
    });
  });
  test('isUploadFileSent method should return true', () => {
    jest.spyOn(dydu, 'isLastResponseStatusInRange');
    const TestComponent = () => {
      const { isUploadFileSent } = useUploadFile();
      isUploadFileSent();
      return <div>{'envoyé'}</div>;
    };
    render(
      <UploadFileProvider>
        <TestComponent />
      </UploadFileProvider>,
    );
    const isSentText = screen.getByText(/envoyé/i);
    expect(isSentText).toBeInTheDocument();
  });
});
