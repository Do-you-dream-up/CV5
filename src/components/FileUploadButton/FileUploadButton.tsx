import { documentCreateElement, isDefined } from '../../tools/helpers';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '../../styles/styledComponent';
import Scroll from '../Scroll/Scroll';
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
        throw new Error('error while cancel selection');
      }
      setDisable(true);
      processUserFileSelection(file);
    },
    [defaultLabel, onSelectFile, processUserFileSelection],
  );

  const openFileonClick = useCallback(() => {
    const input = documentCreateElement('input', { id: inputId, type: 'file', hidden: 'true' });
    input.onchange = onSelect;
    inputRef.current = input;
    input.click();
  }, [onSelect]);

  return (
    <Scroll>
      <Button data-testid="file-upload-button" onClick={openFileonClick} disabled={disable}>
        {defaultLabel}
      </Button>
    </Scroll>
  );
}
