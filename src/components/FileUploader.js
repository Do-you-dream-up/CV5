/* eslint-disable */
import PropTypes from 'prop-types';
import { useUploadFile } from '../contexts/UploadFileContext';
import { useCallback } from 'react';

const inputId = 'btn-fileuploader';

export default function FileUploader({ maxSize, accept }) {
  const { onSelectFile } = useUploadFile();

  const onSelect = useCallback(
    (event) => {
      console.log('event selection', event.target.files);
      try {
        onSelectFile(event.target.files[0], maxSize, accept);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [maxSize, accept],
  );

  return (
    <button>
      <input
        accept={accept}
        id={inputId}
        type="file"
        hidden
        onChange={onSelect}
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
