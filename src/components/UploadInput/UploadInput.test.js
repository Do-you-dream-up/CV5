import '@testing-library/jest-dom';

import { act, fireEvent, render, waitFor } from '@testing-library/react';

import UploadInput from './UploadInput';
import dydu from '../../tools/dydu';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

jest.mock('../../tools/dydu', () => ({
  __esModule: true,
  default: {
    sendUploadFile: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: jest.fn().mockImplementation((string) => {
      if (string === 'uploadFile.send') {
        return 'Envoyer ce fichier';
      } else {
        return 'Remplacer le fichier à télécharger';
      }
    }),
  }),
}));
jest.mock('../../contexts/UploadFileContext', () => ({
  useUploadFile: jest.fn().mockReturnValue({
    fileSelected: '',
    handleCancel: () => {},
    errorFormatMessage: '',
    isUploadFileReturnSuccess: false,
    fileName: 'file name',
    setIsFileUploadSuccess: jest.fn(),
  }),
}));
describe('UploadInput', () => {
  it('render the UploadInput component', () => {
    let screen;
    act(() => {
      screen = render(<UploadInput />);
    });

    expect(screen.getByTestId('footer-upload-input')).toBeInTheDocument();
  });

  test('should call sendUploadFile function when Send button is clicked', () => {
    const mockSendUploadFile = jest.spyOn(dydu, 'sendUploadFile').mockResolvedValue(true);
    const fileContent = 'file content';
    const file = new File([new Blob([fileContent], { type: 'application/pdf' })], 'filename.pdf', {
      type: 'application/pdf',
    });

    const isUploadFileReturnSuccessMock = jest.fn();
    let screen;
    act(() => {
      screen = render(<UploadInput />);
    });

    fireEvent.change(screen.getByText('Remplacer le fichier à télécharger'), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByText('Envoyer ce fichier'));

    waitFor(() => expect(isUploadFileReturnSuccessMock).toHaveBeenCalled());

    waitFor(() => expect(mockSendUploadFile).toHaveBeenCalledWith(file));
  });
});
