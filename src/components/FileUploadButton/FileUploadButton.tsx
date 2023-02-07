import { useCallback, useRef } from 'react';

import { Button } from '../../styles/styledComponent';
import { isDefined } from '../../tools/helpers';
import useId from '../../tools/hooks/useId';
import { useUploadFile } from '../../contexts/UploadFileContext';

interface FileUploadButtonProps {
  onSelect?: () => void;
  label?: string;
  keepActive?: boolean;
}

export default function FileUploadButton({ label = 'upload', keepActive }: FileUploadButtonProps) {
  const inputRef = useRef<any>(null);

  const { onSelectFile, isInDisabledList, addToDisabledList, extractFileFromEvent } = useUploadFile();
  const inputId = useId();

  const processUserFileSelection = useCallback(
    (file) => {
      try {
        onSelectFile && onSelectFile(file, inputRef);
        !keepActive && addToDisabledList && addToDisabledList(label);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [onSelectFile, inputRef, addToDisabledList],
  );

  const onSelect = useCallback(
    (event) => {
      const file = extractFileFromEvent && extractFileFromEvent(event);
      const hasUserCanceledFileSelection = !isDefined(file?.name);
      if (hasUserCanceledFileSelection) return;
      processUserFileSelection(file);
    },
    [label, addToDisabledList, onSelectFile, processUserFileSelection],
  );

  return (
    <Button disabled={isInDisabledList && isInDisabledList(label)}>
      <input
        id={inputId}
        type="file"
        hidden
        onChange={onSelect}
        disabled={isInDisabledList && isInDisabledList(label)}
        ref={inputRef}
      />
      <label htmlFor={inputId}>{label}</label>
    </Button>
  );
}
