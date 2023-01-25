import { useCallback, useMemo, useRef } from 'react';

import { isDefined } from '../tools/helpers';
import useId from '../tools/hooks/useId';
import { useUploadFile } from '../contexts/UploadFileContext';

interface FileUploadButtonProps {
  accept?: string;
  maxSize?: number;
  onSelect?: () => void;
  label?: string;
  keepActive?: boolean;
}

export default function FileUploadButton({ label = 'upload', maxSize, accept, keepActive }: FileUploadButtonProps) {
  const inputRef = useRef<any>(null);
  console.log('🚀 ~ file: FileUploadButton.tsx:17 ~ FileUploadButton ~ inputRef', inputRef.current?.value);
  const { onSelectFile, isInDisabledList, addToDisabledList } = useUploadFile();
  const inputId = useId();

  const extractFileFromEvent = (event) => event.target.files[0];

  const processUserFileSelection = useCallback(
    (file) => {
      try {
        onSelectFile(file, maxSize, accept, inputRef);
        !keepActive && addToDisabledList(label);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [onSelectFile, inputRef, addToDisabledList, maxSize, accept],
  );

  const onSelect = useCallback(
    (event) => {
      console.log('🚀 ~ file: FileUploadButton.tsx:64 ~ FileUploadButton ~ event', event);
      const file = extractFileFromEvent(event);
      const hasUserCanceledFileSelection = !isDefined(file?.name);
      if (hasUserCanceledFileSelection) return;
      processUserFileSelection(file);
    },
    [maxSize, accept, label, addToDisabledList, onSelectFile, processUserFileSelection],
  );

  console.log(
    '🚀 ~ file: FileUploadButton.tsx:50 ~ !keepActive || isInDisabledList(label)',
    !keepActive || isInDisabledList(label),
  );
  return (
    <button disabled={isInDisabledList(label)}>
      <input
        accept={accept}
        id={inputId}
        type="file"
        hidden
        onChange={onSelect}
        disabled={isInDisabledList(label)}
        ref={inputRef}
      />
      <label htmlFor={inputId}>{label}</label>
    </button>
  );
}
