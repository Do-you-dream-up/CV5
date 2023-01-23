/* eslint-disable */
import { useCallback } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_ACCEPT = '.jpg, .png';
const inputId = 'btn-fileuploader';

export default function FileUploader({ maxSize = 50000, accept = DEFAULT_ACCEPT, onSelect }) {
  const validateFileSizeThrowError = useCallback(
    (file) => {
      // check extension + size
      const fs = getFileSize(file);
      if (fs > maxSize) throw new Error('Maximum size reached, cannot upload the file');
    },
    [maxSize],
  );

  const validateFileExtensionThrowError = useCallback(
    (file) => {
      const allowedFormat = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
      ];
      // TODO: check file extension
    },
    [accept],
  );

  const validateFileThrowError = useCallback((file) => {
    validateFileSizeThrowError(file);
    validateFileExtensionThrowError(file);
  }, []);

  const onSelectFile = useCallback((eventFileSelection) => {
    try {
      const file = eventFileSelection.target.files[0];
      validateFileThrowError(file);
      onSelect(file);
    } catch (e) {
      console.log('Error while getting file from event');
    }
  }, []);

  return (
    <button>
      <input
        accept={accept}
        id={inputId}
        type="file"
        hidden
        onChange={onSelectFile}
        //disabled={isFileActive}
        //ref={inputRef}
      />
      <label htmlFor={inputId}>upload</label>
    </button>
  );
}

FileUploader.propTypes = {
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  onSelect: PropTypes.func,
};

const getFileSize = (file) => Math.ceil(file.size / Math.pow(1024, 1));
