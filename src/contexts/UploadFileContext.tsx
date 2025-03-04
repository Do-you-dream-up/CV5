import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ALLOWED_FORMAT } from '../tools/constants';
import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';
import useId from "../tools/hooks/useId";

interface UploadFileContextProps {
  fileSelected?: File | null;
  isFileUploadSuccess?: boolean;
  fileName?: string;
  validateFile?: (file: File) => boolean;
  displaySuccessOrErrorMessage?: (isFormatAllowed: Promise<boolean>, file: File) => boolean;
  onSelectFile?: (file: File) => void;
  errorFormatMessage?: string | null;
  showButtonUploadFile?: boolean;
  getFileSize?: (file: File) => number;
  extractFileFromEvent?: (event: any) => File;
  handleCancel?: () => void;
  showConfirmSelectedFile?: boolean;
  showUploadFileButton?: any;
  isUploadFileReturnSuccess?: () => void;
  readBuffer?: (file: File) => any;
  arrayBufferToHexString?: (arrayBuffer: ArrayBuffer) => string;
}

interface UploadFileProviderProps {
  children: ReactNode;
}

const UploadFileContext = createContext({} as UploadFileContextProps);
export const useUploadFile = () => useContext(UploadFileContext);

export const UploadFileProvider = ({ children }: UploadFileProviderProps) => {
  const { t } = useTranslation('translation');
  const { showUploadFileButton, rewordAfterGuiAction } = useDialog();
  const [selected, setSelected] = useState<File | null>(null);
  const [errorFormatMessage, setErrorFormatMessage] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isFileUploadSuccess, setIsFileUploadSuccess] = useState<boolean>(false);
  const fileName = useMemo(() => fileSelected?.name || '', [fileSelected]);
  const extractFileFromEvent = (event) => (setFileSelected(event.target.files[0]), event.target.files[0]);
  const getFileSize = (file) => Math.ceil(file.size / 1024 ** 1);
  const MSG_FORMAT_MAGIC_NUMBER = 'D0CF11E0A1B11AE1';
  const [isFileSent, setIsFileSent] = useState<{ id?: boolean }>({});

  const validateFile: (file: File) => boolean = useCallback((file: File) => {
    let isFormatAllowed: Promise<boolean>;
    if (file.type) {
      isFormatAllowed = Promise.resolve(ALLOWED_FORMAT.includes(file.type));
    } else if (file.name?.slice(-4) === '.msg') {
      isFormatAllowed = checkMsgFormat(file);
    } else {
      isFormatAllowed = Promise.resolve(false);
    }
    return displaySuccessOrErrorMessage(isFormatAllowed, file);
  }, []);

  function displaySuccessOrErrorMessage(isFormatAllowed, file): boolean {
    return isFormatAllowed.then((isFormatAllowedResult: boolean) => {
      const fileSize = getFileSize(file);
      if (isFormatAllowedResult && fileSize <= 10000) setErrorFormatMessage('');
      else if (!isFormatAllowedResult && fileSize > 10000)
        setErrorFormatMessage(t('uploadFile.errorFormatAndSizeMessage'));
      else if (!isFormatAllowedResult) setErrorFormatMessage(t('uploadFile.errorFormatMessage'));
      else setErrorFormatMessage(t('uploadFile.errorSizeMessage'));

      return isFormatAllowedResult && fileSize <= 10000;
    });
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

  const onSelectFile = (file) => (
    setIsFileUploadSuccess(false), validateFile?.(file), setSelected(file)
  );

  const handleCancel = () => (
    setSelected(null)
  );

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  useEffect(() => {
    if (isFileUploadSuccess) {
      window.dydu?.chat?.handleRewordClicked(rewordAfterGuiAction, { hide: true, doNotRegisterInteraction: true });
    }
  }, [isFileUploadSuccess]);

  const showButtonUploadFile = showConfirmSelectedFile && !isFileUploadSuccess;

  const dataContext = useMemo(
    () => ({
      fileSelected,
      validateFile,
      onSelectFile,
      errorFormatMessage,
      showButtonUploadFile,
      getFileSize,
      extractFileFromEvent,
      handleCancel,
      showConfirmSelectedFile,
      showUploadFileButton,
      isFileUploadSuccess,
      setIsFileUploadSuccess,
      fileName,
      displaySuccessOrErrorMessage,
      arrayBufferToHexString,
      readBuffer,
      isFileSent,
      setIsFileSent,
    }),
    [
      onSelectFile,
      fileSelected,
      errorFormatMessage,
      showButtonUploadFile,
      extractFileFromEvent,
      showConfirmSelectedFile,
      validateFile,
      getFileSize,
      handleCancel,
      showUploadFileButton,
      isFileUploadSuccess,
      setIsFileUploadSuccess,
      fileName,
      displaySuccessOrErrorMessage,
      arrayBufferToHexString,
      readBuffer,
      isFileSent,
      setIsFileSent,
    ],
  );

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
};
