import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useUploadFile } from '../contexts/UploadFileContext';
import useId from '../tools/hooks/useId';
import { isDefined } from '../tools/helpers';

export default function FileUploader({ label = 'upload', maxSize, accept, disableOnFileSelection = true }) {
  const { onSelectFile, isInDisabledList, addToDisabledList } = useUploadFile();
  const inputId = useId();

  const processUserFileSelection = useCallback(
    (file) => {
      try {
        onSelectFile(file, maxSize, accept);
        addToDisabledList(label);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [onSelectFile, addToDisabledList, maxSize, accept],
  );

  const onSelect = useCallback(
    (event) => {
      const file = extractFileFromEvent(event);
      const hasUserCanceledFileSelection = !isDefined(file?.name);
      if (hasUserCanceledFileSelection) return;
      processUserFileSelection(file);
    },
    [maxSize, accept, label, addToDisabledList, onSelectFile, processUserFileSelection],
  );

  const disabled = useCallback(() => {
    return disableOnFileSelection && isInDisabledList(label);
  }, [disableOnFileSelection, label, isInDisabledList]);

  return (
    <button disabled={disabled()}>
      <input
        accept={accept}
        id={inputId}
        type="file"
        hidden
        onChange={onSelect}
        disabled={disabled()}
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
  disableOnFileSelection: PropTypes.bool,
};

const extractFileFromEvent = (event) => event.target.files[0];
