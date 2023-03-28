import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '../../styles/styledComponent';
import Scroll from '../Scroll/Scroll';
import { isDefined } from '../../tools/helpers';
import useId from '../../tools/hooks/useId';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

interface FileUploadButtonProps {
  onSelect?: () => void;
  label?: string;
  disabled: boolean;
  keepActive?: boolean;
}

export default function FileUploadButton({ label }: FileUploadButtonProps) {
  const [t] = useTranslation('translation');
  const defaultLabel = useMemo(() => label || t('uploadFile.label'), [label]);
  const inputRef = useRef<any>(null);
  const [disable, setDisable] = useState(false);
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
      if (hasUserCanceledFileSelection) {
        setDisable(false);
        return;
      }
      setDisable(true);
      processUserFileSelection(file);
    },
    [defaultLabel, onSelectFile, processUserFileSelection],
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
      <Button data-testid="file-upload-button" onClick={openFileonClick} disabled={disable}>
        {defaultLabel}
      </Button>
    </Scroll>
  );
}
