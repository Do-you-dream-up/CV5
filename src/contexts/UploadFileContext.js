/* eslint-disable */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { isDefined } from '../tools/helpers';
import { useDialog } from './DialogContext';

const UploadFileContext = React.createContext();
export const useUploadFile = () => React.useContext(UploadFileContext);

const DEFAULT_MAX_SIZE = 1024 * 6;

export default function UploadFileProvider({ children }) {
  const { showUploadFileButton: appendButtonUploadFileAsInteraction } = useDialog();
  const [selected, setSelected] = useState(null);
  const [inputRef, setInputRef] = useState(null);

  const [listDisabledInstance, setDisabledList] = useState([]);

  const validateFileSizeThrowError = useCallback((file, maxSize) => {
    // check extension + size
    const fs = getFileSize(file);
    if (!isDefined(maxSize)) maxSize = DEFAULT_MAX_SIZE;
    if (fs > maxSize) throw new Error('Maximum size reached, cannot upload the file');
  }, []);

  const validateFileExtensionThrowError = useCallback((file, accept) => {
    const allowedFormat = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
    ];
    // TODO: check file extension
  }, []);

  const validateFileThrowError = useCallback((file, maxSize, accept) => {
    validateFileSizeThrowError(file, maxSize);
    validateFileExtensionThrowError(file, accept);
  }, []);

  const onSelectFile = (file, maxSize, accept, inputRef) => {
    setSelected(file);
    setInputRef(inputRef);
  };

  const handleCancel = () => {
    setSelected(null);
    inputRef.current.value = null;
    removeFromDisabledList();
  };

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  const isFileValid = useCallback(() => {
    return validateFileSizeThrowError(selected);
  }, [validateFileExtensionThrowError, selected]);

  const isInDisabledList = useCallback(
    (id) => {
      return listDisabledInstance.includes(id);
    },
    [listDisabledInstance],
  );

  const removeFromDisabledList = useCallback((id) => {
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
      isFileValid,
      validateFileThrowError,
      onSelectFile,
      handleCancel,
      showConfirmSelectedFile,
      showUploadFileButton: appendButtonUploadFileAsInteraction,
    };
  }, [
    removeFromDisabledList,
    isInDisabledList,
    addToDisabledList,
    onSelectFile,
    showConfirmSelectedFile,
    handleCancel,
    appendButtonUploadFileAsInteraction,
    listDisabledInstance,
  ]);

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}

UploadFileProvider.propTypes = {
  children: PropTypes.node,
};

const getFileSize = (file) => Math.ceil(file.size / Math.pow(1024, 1));
