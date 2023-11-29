import '@testing-library/jest-dom';

import { UploadFileProvider, useUploadFile } from '../UploadFileContext';
import { findByText, render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { renderHook } from '@testing-library/react-hooks';

describe('UploadFileContext', () => {
  it('should renders without crashing', () => {
    render(
      <UploadFileProvider>
        <div data-testid="test-child">Test child</div>
      </UploadFileProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeDefined();
  });
});

describe('validateFile', () => {
  test('should validate a file with allowed format', async () => {
    const file = new File(['Hello, World!'], 'hello.txt', { type: 'text/plain' });

    const TestComponent = () => {
      const { validateFile } = useUploadFile();
      const [isValidated, setIsValidated] = useState(null);

      useEffect(() => {
        if (validateFile) {
          validateFile(file).then((result) => {
            setIsValidated(result);
          });
        }
      }, [file, validateFile]);

      return <div>{isValidated !== null ? isValidated.toString() : ''}</div>;
    };

    const { findByText } = render(
      <UploadFileProvider>
        <TestComponent />
      </UploadFileProvider>,
    );

    const textElement = await findByText('true' as HTMLElement);
    expect(textElement).toBeInTheDocument();
  });

  test('should not validate a file with not allowed format', async () => {
    const file = new File(['Hello, World!'], 'hello.zip', { type: 'application/zip' });

    const TestComponent = () => {
      const { validateFile } = useUploadFile();
      const [isValidated, setIsValidated] = useState(null);

      useEffect(() => {
        if (validateFile) {
          validateFile(file).then((result) => {
            setIsValidated(result);
          });
        }
      }, [file, validateFile]);

      return <div>{isValidated !== null ? isValidated.toString() : ''}</div>;
    };

    const { findByText } = render(
      <UploadFileProvider>
        <TestComponent />
      </UploadFileProvider>,
    );

    const textElement = await findByText('false' as HTMLElement);
    expect(textElement).toBeInTheDocument();
  });
});

describe('arrayBufferToHexString', () => {
  test('should convert array buffer to hex string', () => {
    const { result } = renderHook(() => useUploadFile(), { wrapper: UploadFileProvider });

    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint8(0, 0xd0);
    view.setUint8(1, 0xcf);
    view.setUint8(2, 0x11);
    view.setUint8(3, 0xe0);
    view.setUint8(4, 0xa1);
    view.setUint8(5, 0xb1);
    view.setUint8(6, 0x1a);
    view.setUint8(7, 0xe1);

    let hexString;

    if (result.current.arrayBufferToHexString) {
      hexString = result.current.arrayBufferToHexString(buffer);
    }

    const expectedHexString = 'D0CF11E0A1B11AE1';

    expect(hexString).toBe(expectedHexString);
  });
});

describe('readBuffer', () => {
  test('should read file as ArrayBuffer', async () => {
    const { result } = renderHook(() => useUploadFile(), { wrapper: UploadFileProvider });
    const text = 'Hello, World!';
    const file = new File([text as BlobPart], 'hello.txt', { type: 'text/plain' });

    let resultBuffer;

    if (result.current.readBuffer) {
      resultBuffer = await result.current.readBuffer(file);
    }

    expect(resultBuffer instanceof ArrayBuffer).toBe(true);
    expect(resultBuffer.byteLength).toBe(text.length);
  });
});
