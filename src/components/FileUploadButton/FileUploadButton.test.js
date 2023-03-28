import '@testing-library/jest-dom';

import * as helpers from '../../tools/helpers';

import { act, fireEvent, waitFor } from '@testing-library/react';

import FileUploadButton from './FileUploadButton';
import { render } from '../../tools/test-utils';
import { useUploadFile } from '../../contexts/UploadFileContext';

jest.mock('../../contexts/UploadFileContext', () => ({
  useUploadFile: jest.fn(),
}));

xdescribe('FileUploadButton', () => {
  it('should call the onSelectFile method on click', async () => {
    const onSelectFileMock = jest.fn();
    const onClickMock = jest.fn();
    useUploadFile.mockReturnValue({
      onSelectFile: onSelectFileMock,
      extractFileFromEvent: { name: 'fileName' },
    });

    act(() => {
      const { getByTestId } = render(<FileUploadButton />);
      fireEvent.click(getByTestId('file-upload-button'));
      const input = document.createElement('input');
      input.setAttribute('type', 'file');

      fireEvent.change(input);
    });

    await waitFor(() => {
      expect(onSelectFileMock).toHaveBeenCalled();
    });
  });
});
