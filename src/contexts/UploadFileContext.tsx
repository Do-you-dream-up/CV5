import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import dydu from 'src/tools/dydu';
import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';

interface UploadFileContextProps {
  removeFromDisabledList?: (id: any) => void;
  isInDisabledList?: (id: any) => boolean;
  addToDisabledList?: (id: any) => void;
  fileSelected?: File | null;
  isSent?: boolean;
  validateFile?: (file: File) => void;
  onSelectFile?: (file: File, inputRef: any) => void;
  errorFormatMessage?: string | null;
  getFileSize?: (file: File) => number;
  extractFileFromEvent?: (event: any) => File;
  handleCancel?: () => void;
  showConfirmSelectedFile?: boolean;
  showUploadFileButton?: any;
  IsUploadFileSent?: () => void;
}

interface UploadFileProviderProps {
  children: ReactNode;
}

const UploadFileContext = createContext({} as UploadFileContextProps);
export const useUploadFile = () => useContext(UploadFileContext);

export default function UploadFileProvider({ children }: UploadFileProviderProps) {
  const [t] = useTranslation('translation');
  const { showUploadFileButton: appendButtonUploadFileAsInteraction } = useDialog();
  const [selected, setSelected] = useState<File | null>(null);
  const [inputRef, setInputRef] = useState<any>(null);
  const [errorFormatMessage, setErrorFormatMessage] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [listDisabledInstance, setDisabledList] = useState<any[]>([]);
  const [isSent, setIsSent] = useState<boolean>(false);

  const extractFileFromEvent = (event: any) => {
    setFileSelected(event.target.files[0]);
    return event.target.files[0];
  };
  const getFileSize = (file: File) => Math.ceil(file.size / Math.pow(1024, 1));

  const validateFile = (file: File) => {
    const allowedFormat = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
    ];
    const allowedFormatTargeted = allowedFormat.includes(file.type);
    if (allowedFormatTargeted && getFileSize(file) <= 100) {
      return true;
    } else if (!allowedFormatTargeted && getFileSize(file) > 100) {
      setErrorFormatMessage(t('uploadFile.errorFormatAndSizeMessage'));
      return false;
    } else if (!allowedFormatTargeted) {
      setErrorFormatMessage(t('uploadFile.errorFormatMessage'));
      return false;
    } else {
      setErrorFormatMessage(t('uploadFile.errorSizeMessage'));
      return false;
    }
  };

  const onSelectFile = (file: File, inputRef: any) => {
    validateFile?.(file);
    setSelected(file);
    setInputRef(inputRef);
  };

  const handleCancel = () => {
    setSelected(null);
    inputRef.current.value = null;
    removeFromDisabledList();
  };

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  const isInDisabledList = useCallback(
    (id) => {
      return listDisabledInstance.includes(id);
    },
    [listDisabledInstance],
  );

  const removeFromDisabledList = useCallback(() => {
    setDisabledList([]);
  }, []);

  const addToDisabledList = useCallback((id) => {
    setDisabledList((list) => list.concat([id]));
  }, []);

  const IsUploadFileSent = useCallback(() => {
    const status = dydu.getLastResponse().status;
    const statusOk = status && status >= 200 && status <= 206;
    if (statusOk) setIsSent(true);
  }, [isSent]);

  const dataContext = useMemo(() => {
    return {
      removeFromDisabledList,
      isInDisabledList,
      addToDisabledList,
      fileSelected,
      validateFile,
      onSelectFile,
      errorFormatMessage,
      getFileSize,
      extractFileFromEvent,
      handleCancel,
      showConfirmSelectedFile,
      showUploadFileButton: appendButtonUploadFileAsInteraction,
      IsUploadFileSent,
      isSent,
    };
  }, [
    removeFromDisabledList,
    isInDisabledList,
    addToDisabledList,
    onSelectFile,
    fileSelected,
    errorFormatMessage,
    extractFileFromEvent,
    showConfirmSelectedFile,
    validateFile,
    getFileSize,
    handleCancel,
    appendButtonUploadFileAsInteraction,
    listDisabledInstance,
    IsUploadFileSent,
    isSent,
  ]);

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}
