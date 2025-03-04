import '@testing-library/jest-dom';

import * as helpers from '../../tools/helpers';

import { act, fireEvent, waitFor } from '@testing-library/react';

import FileUploadButton from './FileUploadButton';
import { render } from '../../tools/test-utils';
import { useUploadFile } from '../../contexts/UploadFileContext';

jest.mock('../../contexts/UploadFileContext', () => ({
  useUploadFile: jest.fn(),
}));

describe('FileUploadButton', () => {
  it('should call the onSelectFile method on click', async () => {
    const onSelectFileMock = jest.fn();

    useUploadFile.mockReturnValue({
      onSelectFile: onSelectFileMock,
      isFileSent: true,
      extractFileFromEvent: { name: 'fileName' },
    });

    const { getByTestId } = render(<FileUploadButton />);
    fireEvent.click(getByTestId('file-upload-button'));

    expect(getByTestId('file-upload-button')).toBeInTheDocument();
  });
});
