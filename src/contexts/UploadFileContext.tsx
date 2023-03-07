import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ALLOWED_FORMAT } from '../../src/tools/constants';
import dydu from 'src/tools/dydu';
import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';

interface UploadFileContextProps {
  fileSelected?: File | null;
  isSent?: boolean;
  fileName?: string;
  validateFile?: (file: File) => void;
  onSelectFile?: (file: File, inputRef: any) => void;
  errorFormatMessage?: string | null;
  showButtonUploadFile: boolean;
  getFileSize?: (file: File) => number;
  extractFileFromEvent?: (event: any) => File;
  handleCancel?: () => void;
  showConfirmSelectedFile?: boolean;
  showUploadFileButton?: any;
  isUploadFileSent?: () => void;
}

interface UploadFileProviderProps {
  children: ReactNode;
}

const UploadFileContext = createContext({} as UploadFileContextProps);
export const useUploadFile = () => useContext(UploadFileContext);

export default function UploadFileProvider({ children }: UploadFileProviderProps) {
  const [t] = useTranslation('translation');
  const { showUploadFileButton } = useDialog();
  const [selected, setSelected] = useState<File | null>(null);
  const [inputRef, setInputRef] = useState<any>(null);
  const [errorFormatMessage, setErrorFormatMessage] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isSent, setIsSent] = useState<boolean>(false);
  const fileName = useMemo(() => fileSelected?.name || '', [fileSelected]);
  const extractFileFromEvent = (event) => (setFileSelected(event.target.files[0]), event.target.files[0]);
  const getFileSize = (file) => Math.ceil(file.size / 1024 ** 1);

  const validateFile = useCallback((file) => {
    const allowedFormatTargeted = ALLOWED_FORMAT.includes(file.type);
    const fileSize = getFileSize(file);

    if (allowedFormatTargeted && fileSize <= 100) setErrorFormatMessage('');
    else if (!allowedFormatTargeted && fileSize > 100) setErrorFormatMessage(t('uploadFile.errorFormatAndSizeMessage'));
    else if (!allowedFormatTargeted) setErrorFormatMessage(t('uploadFile.errorFormatMessage'));
    else setErrorFormatMessage(t('uploadFile.errorSizeMessage'));

    return allowedFormatTargeted && fileSize <= 100;
  }, []);

  const onSelectFile = (file, inputRef) => (validateFile?.(file), setSelected(file), setInputRef(inputRef));
  const handleCancel = () => (setSelected(null), (inputRef.current.value = null));

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  const isUploadFileSent = useCallback(() => {
    dydu.isLastResponseStatusInRange(200, 206);
    setIsSent(true);
  }, []);

  const showButtonUploadFile = showConfirmSelectedFile && !isSent;

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
      isUploadFileSent,
      isSent,
      fileName,
    }),
    [
      onSelectFile,
      fileSelected,
      errorFormatMessage,
      showButtonUploadFile,
      extractFileFromEvent,
      showConfirmSelectedFile,
      isUploadFileSent,
      validateFile,
      getFileSize,
      handleCancel,
      showUploadFileButton,
      isSent,
      fileName,
    ],
  );

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}
