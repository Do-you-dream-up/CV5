import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ALLOWED_FORMAT } from '../../src/tools/constants';
import dydu from '../../src/tools/dydu';
import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';

interface UploadFileContextProps {
  fileSelected?: File | null;
  isFileUploadSuccess?: boolean;
  fileName?: string;
  validateFile?: (file: File) => boolean;
  displaySuccessOrErrorMessage?: (isFormatAllowed: Promise<boolean>, file: File) => boolean;
  onSelectFile?: (file: File, inputRef: any) => void;
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
  buttonIdDisabled?: {
    id?: boolean;
  };
  setButtonIdDisabled?: Dispatch<SetStateAction<{ id?: boolean | undefined }>>;
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
  const [inputRef, setInputRef] = useState<any>(null);
  const [errorFormatMessage, setErrorFormatMessage] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isFileUploadSuccess, setIsFileUploadSuccess] = useState<boolean>(false);
  const [buttonIdDisabled, setButtonIdDisabled] = useState<{ id?: boolean }>({});
  const fileName = useMemo(() => fileSelected?.name || '', [fileSelected]);
  const extractFileFromEvent = (event) => (setFileSelected(event.target.files[0]), event.target.files[0]);
  const getFileSize = (file) => Math.ceil(file.size / 1024 ** 1);
  const MSG_FORMAT_MAGIC_NUMBER = 'D0CF11E0A1B11AE1';

  const validateFile: (file: File) => boolean = useCallback((file: File) => {
    let isFormatAllowed: Promise<boolean>;

    if (file.type) {
      isFormatAllowed = Promise.resolve(ALLOWED_FORMAT.includes(file.type));
    } else if (file.name?.slice(-4) === '.msg') {
      isFormatAllowed = checkMsgFormat(file);
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

  const onSelectFile = (file, inputRef) => (
    setIsFileUploadSuccess(false), validateFile?.(file), setSelected(file), setInputRef(inputRef)
  );

  const handleCancel = () => (
    setSelected(null),
    setButtonIdDisabled({ ...buttonIdDisabled, [inputRef.current.id]: false }),
    (inputRef.current.value = null)
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
      buttonIdDisabled,
      setButtonIdDisabled,
      displaySuccessOrErrorMessage,
      arrayBufferToHexString,
      readBuffer,
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
      buttonIdDisabled,
      setButtonIdDisabled,
      displaySuccessOrErrorMessage,
      arrayBufferToHexString,
      readBuffer,
    ],
  );

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
};
