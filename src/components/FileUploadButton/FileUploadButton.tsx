import { useCallback, useRef } from 'react';

import { Button } from '../../styles/styledComponent';
import Scroll from '../Scroll/Scroll';
import { isDefined } from '../../tools/helpers';
import useId from '../../tools/hooks/useId';
import { useUploadFile } from '../../contexts/UploadFileContext';

interface FileUploadButtonProps {
  onSelect?: () => void;
  label?: string;
  keepActive?: boolean;
}

export default function FileUploadButton({ label = 'upload' }: FileUploadButtonProps) {
  const inputRef = useRef<any>(null);

  const { onSelectFile, extractFileFromEvent } = useUploadFile();
  const inputId = useId();

  const processUserFileSelection = useCallback(
    (file) => {
      try {
        onSelectFile?.(file, inputRef);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [onSelectFile, inputRef],
  );

  const onSelect = useCallback(
    (event) => {
      const file = extractFileFromEvent?.(event);
      const hasUserCanceledFileSelection = !isDefined(file?.name);
      if (hasUserCanceledFileSelection) return;
      processUserFileSelection(file);
    },
    [label, onSelectFile, processUserFileSelection],
  );

  const openFileonClick = () => {
    const input = document.createElement('input');
    input.setAttribute('id', inputId);
    input.setAttribute('type', 'file');
    input.setAttribute('hidden', 'true');
    input.onchange = onSelect;
    inputRef.current = input;
    input.click();
  };

  return (
    <Scroll>
      <Button data-testid="file-upload-button" onClick={openFileonClick}>
        {label}
      </Button>
    </Scroll>
  );
}
