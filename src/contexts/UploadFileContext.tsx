import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';

interface UploadFileContextProps {
  selectedFiles: File[];
  onSelectFiles?: (event: any, inputRef: any) => void;
  invalidSelectedFilesMessage?: string;
  mustShowSendSelectedFilesButton?: boolean;
  handleCancel?: () => void;
  showUploadFileButton?: any;
  setIsFilesUploadSuccess: (isSuccess: boolean) => void;
  buttonIdDisabled: any;
  setButtonIdDisabled?: Dispatch<SetStateAction<{ id: boolean | undefined }>>;
  allowedFormatExtensions: string[];
  isFileSent?: { id?: boolean };
}

interface UploadFileProviderProps {
  children: ReactNode;
}

const UploadFileContext = createContext({} as UploadFileContextProps);
export const useUploadFile = () => useContext(UploadFileContext);

export const UploadFileProvider = ({ children }: UploadFileProviderProps) => {
  const { t } = useTranslation('translation');
  const { showUploadFileButton, rewordAfterGuiAction } = useDialog();
  const [inputRef, setInputRef] = useState<any>(null);
  const [invalidSelectedFilesMessage, setInvalidSelectedFilesMessage] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>(new Array(0));
  const [isFilesUploadSuccess, setIsFilesUploadSuccess] = useState<boolean>(false);
  const [buttonIdDisabled, setButtonIdDisabled] = useState<{ id?: boolean }>({});
  const [isFileSent, setIsFileSent] = useState<{ id?: boolean }>({});
  const getFileSize = (file) => Math.ceil(file.size / 1024);
  const MSG_FORMAT_MAGIC_NUMBER = 'D0CF11E0A1B11AE1';

  // commented parts could be uncommented on demand later
  // idea is to keep enum as small as possible as it is also used in the filter zone
  // of the '<input...>' element
  enum AllowedFormat {
    '.png' = 'image/png',
    '.jpg' = 'image/jpeg',
    '.jpeg' = 'image/jpeg',
    '.jfif' = 'image/jpeg',
    '.pjpeg' = 'image/jpeg',
    '.pjp' = 'image/jpeg',
    '.svg' = 'image/svg+xml',
    '.gif' = 'image/gif',
    '.webp' = 'image/webp',
    // '.bmp' = 'image/bmp',
    // '.ico' = 'image/x-icon',
    // '.cur' = 'image/x-icon',
    // '.tif' = 'image/tiff',
    // '.tiff' = 'image/tiff',
    '.pdf' = 'application/pdf',
    '.csv' = 'text/csv',
    '.txt' = 'text/plain',
    '.doc' = 'application/msword',
    '.dot' = 'application/msword',
    '.docx' = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls' = 'application/vnd.ms-excel',
    '.xlt' = 'application/vnd.ms-excel',
    '.xla' = 'application/vnd.ms-excel',
    // '.ppt' = 'application/vnd.ms-powerpoint',
    // '.pot' = 'application/vnd.ms-powerpoint',
    // '.pps' = 'application/vnd.ms-powerpoint',
    // '.ppa' = 'application/vnd.ms-powerpoint',
    '.pptx' = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.odt' = 'application/vnd.oasis.opendocument.text',
    '.ods' = 'application/vnd.oasis.opendocument.spreadsheet',
    '.odp' = 'application/vnd.oasis.opendocument.presentation',
  }

  const allowedFormatExtensions: string[] = Object.keys(AllowedFormat);
  const allowedFormatTypes: string[] = Object.values(AllowedFormat);

  function validateFiles(files: File[]): boolean {
    let allErrorMessages = '';

    if (files && files.length > 0) {
      let isFormatAllowed: boolean;
      files.forEach((file: File) => {
        isFormatAllowed = false;
        if (file.type) {
          isFormatAllowed = allowedFormatTypes.includes(file.type);
        } else if (file.name?.slice(-4) === '.msg') {
          checkMsgFormat(file).then((e: boolean) => {
            isFormatAllowed = e;
          });
        }
        const errorMessage = computeErrorMessage(isFormatAllowed, file);
        if (errorMessage.length > 0) {
          if (allErrorMessages.length == 0) {
            allErrorMessages = errorMessage;
          } else {
            allErrorMessages += '\n<br>' + computeErrorMessage(isFormatAllowed, file);
          }
        }
      });
    }
    if (allErrorMessages.length > 0) {
      console.log('UploadFileContext: validateFiles with errors ' + allErrorMessages);
      setInvalidSelectedFilesMessage(allErrorMessages);
      return true;
    } else {
      setInvalidSelectedFilesMessage('');
    }
    return true;
  }

  function computeErrorMessage(isFormatAllowed: boolean, file: File): string {
    let errorMessage = '';
    const fileSize = getFileSize(file);

    if (!isFormatAllowed) {
      if (fileSize > 10000) {
        errorMessage =
          file.name + ' (' + getReadableFileSizeString(file.size) + '): ' + t('uploadFile.errorFormatAndSizeMessage'); // The file size is too large and the format is not accepted
      } else {
        errorMessage =
          file.name + ' (' + getReadableFileSizeString(file.size) + '): ' + t('uploadFile.errorFormatMessage'); // The file format is not accepted
      }
    } else if (fileSize > 10000) {
      errorMessage = file.name + ' (' + getReadableFileSizeString(file.size) + '): ' + t('uploadFile.errorSizeMessage'); // The file size is too large (max accepted 10 Mo)
    }

    return errorMessage;
  }

  function getReadableFileSizeString(fileSizeInBytes): string {
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes /= 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  function checkMsgFormat(file): Promise<boolean> {
    return readBuffer(file)
      .then((result) => {
        const hexString = arrayBufferToHexString(result);
        return hexString === MSG_FORMAT_MAGIC_NUMBER;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  function arrayBufferToHexString(arrayBuffer): string {
    const bufferView = new DataView(arrayBuffer, 0, 8);
    let hexString = '';
    for (let i = 0; i < bufferView.byteLength; i += 1) {
      const byte = bufferView.getUint8(i).toString(16);
      hexString += byte;
    }
    return hexString.toUpperCase();
  }

  function readBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function onSelectFiles(event: any, inputRef: any) {
    if (event.target.files.length > 5) {
      alert(t('uploadFiles.tooMuchSelected', { maxSize: '5' }));
      return;
    }
    const filesToCheck: File[] = Array.from(event.target.files);
    setIsFilesUploadSuccess(false);

    validateFiles(filesToCheck);
    setInputRef(inputRef);
    setSelectedFiles(filesToCheck);
  }

  function handleCancel() {
    setSelectedFiles(new Array(0));
    if (inputRef) {
      setButtonIdDisabled({ ...buttonIdDisabled, [inputRef.current.id]: false });
      inputRef.current.value = null;
    }
  }

  const showConfirmSelectedFile = useMemo(() => selectedFiles?.length > 0, [selectedFiles]);

  useEffect(() => {
    if (isFilesUploadSuccess) {
      window.dydu?.chat?.handleRewordClicked(rewordAfterGuiAction, { hide: true, doNotRegisterInteraction: true });
    }
  }, [isFilesUploadSuccess]);

  const mustShowSendSelectedFilesButton = showConfirmSelectedFile && !isFilesUploadSuccess;

  const dataContext = useMemo(
    () => ({
      selectedFiles,
      onSelectFiles,
      invalidSelectedFilesMessage,
      mustShowSendSelectedFilesButton,
      handleCancel,
      showUploadFileButton,
      setIsFilesUploadSuccess,
      setButtonIdDisabled,
      allowedFormatExtensions,
      isFileSent,
      setIsFileSent,
    }),
    [
      selectedFiles,
      invalidSelectedFilesMessage,
      mustShowSendSelectedFilesButton,
      showUploadFileButton,
      isFilesUploadSuccess,
      buttonIdDisabled,
      isFileSent,
      setIsFileSent,
    ],
  );

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
};
