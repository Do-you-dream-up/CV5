/* eslint-disable */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDialog } from './DialogContext';
import { isDefined } from '../tools/helpers';

const UploadFileContext = React.createContext();
export const useUploadFile = () => React.useContext(UploadFileContext);

const DEFAULT_MAX_SIZE = 1024 * 10;

export default function UploadFileProvider({ children }) {
  const { showUploadFileButton: appendButtonUploadFileAsInteraction } = useDialog();
  const [selected, setSelected] = useState(null);

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

  const onSelectFile = useCallback(
    (file, maxSize, accept) => {
      try {
        validateFileThrowError(file, maxSize, accept);
        // onSelect(file);
        console.log('FILE', file);
        setSelected(file);
      } catch (e) {
        console.log('Error while getting file from event', e);
      }
    },
    [validateFileThrowError],
  );

  useEffect(() => {
    console.log('selected !', selected);
  }, [selected]);

  const showConfirmSelectedFile = useMemo(() => isDefined(selected), [selected]);

  const dataContext = useMemo(() => {
    return {
      onSelectFile,
      showConfirmSelectedFile,
      showUploadFileButton: appendButtonUploadFileAsInteraction,
    };
  }, [onSelectFile, showConfirmSelectedFile, appendButtonUploadFileAsInteraction]);

  return <UploadFileContext.Provider value={dataContext}>{children}</UploadFileContext.Provider>;
}

UploadFileProvider.propTypes = {
  children: PropTypes.node,
};

const getFileSize = (file) => Math.ceil(file.size / Math.pow(1024, 1));
