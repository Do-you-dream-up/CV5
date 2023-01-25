import React, { useCallback, useMemo, useState } from 'react';

import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';
import { useTranslation } from 'react-i18next';

interface DataContextProps {
  removeFromDisabledList?: (id: any) => void;
  isInDisabledList?: (id: any) => boolean;
  addToDisabledList?: (id: any) => void;
  fileSelected?: File | null;
  validateFile?: (file: File) => void;
  onSelectFile?: (file: File, inputRef: any) => void;
  errorFormatMessage?: string | null;
  getFileSize?: (file: File) => number;
  extractFileFromEvent?: (event: any) => File;
  handleCancel?: () => void;
  showConfirmSelectedFile?: boolean;
  showUploadFileButton?: any;
}

const UploadFileContext = React.createContext<DataContextProps | null>(null);
export const useUploadFile = () => React.useContext(UploadFileContext);

interface UploadFileProviderProps {
  children: React.ReactNode;
}

export default function UploadFileProvider({ children }: UploadFileProviderProps) {
  const [t] = useTranslation('translation');
  const { showUploadFileButton: appendButtonUploadFileAsInteraction } = useDialog();
  const [selected, setSelected] = useState<File | null>(null);
  const [inputRef, setInputRef] = useState<any>(null);
  const [errorFormatMessage, setErrorFormatMessage] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [listDisabledInstance, setDisabledList] = useState<any[]>([]);

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
      setErrorFormatMessage('');
    } else if (!allowedFormatTargeted && getFileSize(file) > 100) {
      setErrorFormatMessage(t('uploadFile.errorFormatAndSizeMessage'));
    } else if (!allowedFormatTargeted) {
      setErrorFormatMessage(t('uploadFile.errorFormatMessage'));
    } else {
      setErrorFormatMessage(t('uploadFile.errorSizeMessage'));
    }
  };

  const onSelectFile = (file: File, inputRef: any) => {
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
  ]);

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}
