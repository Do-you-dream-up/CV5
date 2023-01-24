import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useUploadFile } from '../contexts/UploadFileContext';

const inputId = 'btn-fileuploader';

export default function FileUploader({ label = 'upload', maxSize, accept, disabled = false }) {
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
    <button disabled={disabled}>
      <input
        accept={accept}
        id={inputId}
        type="file"
        hidden
        onChange={onSelect}
        disabled={disabled}
        //ref={inputRef}
      />
      <label htmlFor={inputId}>{label}</label>
    </button>
  );
}

FileUploader.propTypes = {
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  onSelect: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.boolean,
};
