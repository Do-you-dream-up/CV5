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
  validateFile?: (file: File) => void;
  onSelectFile?: (file: File, inputRef: any) => void;
  errorFormatMessage?: string | null;
  showButtonUploadFile?: boolean;
  getFileSize?: (file: File) => number;
  extractFileFromEvent?: (event: any) => File;
  handleCancel?: () => void;
  showConfirmSelectedFile?: boolean;
  showUploadFileButton?: any;
  isUploadFileReturnSuccess?: () => void;
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

  const validateFile = useCallback((file) => {
    const allowedFormatTargeted = ALLOWED_FORMAT.includes(file.type);
    const fileSize = getFileSize(file);

    if (allowedFormatTargeted && fileSize <= 10000) setErrorFormatMessage('');
    else if (!allowedFormatTargeted && fileSize > 10000)
      setErrorFormatMessage(t('uploadFile.errorFormatAndSizeMessage'));
    else if (!allowedFormatTargeted) setErrorFormatMessage(t('uploadFile.errorFormatMessage'));
    else setErrorFormatMessage(t('uploadFile.errorSizeMessage'));

    return allowedFormatTargeted && fileSize <= 10000;
  }, []);

  const onSelectFile = (file, inputRef) => (
    setIsFileUploadSuccess(false), validateFile?.(file), setSelected(file), setInputRef(inputRef)
  );
  const handleCancel = () => (
    setSelected(null),
    setButtonIdDisabled({ ...buttonIdDisabled, [inputRef.current.id]: false }),
    (inputRef.current.value = null)
  );

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  const isUploadFileReturnSuccess = useCallback(() => {
    dydu.isLastResponseStatusInRange(200, 206);
    setIsFileUploadSuccess(true);
  }, []);

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
      isUploadFileReturnSuccess,
      isFileUploadSuccess,
      fileName,
      buttonIdDisabled,
      setButtonIdDisabled,
    }),
    [
      onSelectFile,
      fileSelected,
      errorFormatMessage,
      showButtonUploadFile,
      extractFileFromEvent,
      showConfirmSelectedFile,
      isUploadFileReturnSuccess,
      validateFile,
      getFileSize,
      handleCancel,
      showUploadFileButton,
      isFileUploadSuccess,
      fileName,
      buttonIdDisabled,
      setButtonIdDisabled,
    ],
  );

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
};
