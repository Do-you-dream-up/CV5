import { documentCreateElement, isDefined } from '../../tools/helpers';
import { useCallback, useMemo, useRef } from 'react';

import { Button } from '../../styles/styledComponent';
import Scroll from '../Scroll/Scroll';
import useId from '../../tools/hooks/useId';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from '../UploadInput/styles';

interface FileUploadButtonProps {
  onSelect?: () => void;
  label?: string;
  disabled?: boolean;
  keepActive?: boolean;
}

export default function FileUploadButton({ label }: FileUploadButtonProps) {
  const [t] = useTranslation('translation');
  const defaultLabel = useMemo(() => label || t('uploadFile.label'), [label]);
  const inputRef = useRef<any>(null);
  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });

  const { onSelectFile, extractFileFromEvent, buttonIdDisabled, setButtonIdDisabled } = useUploadFile();
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
      setButtonIdDisabled && setButtonIdDisabled({ ...buttonIdDisabled, [inputRef.current.id]: true });
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
      <Button
        className={classes.upload}
        data-testid="file-upload-button"
        onClick={openFileonClick}
        disabled={buttonIdDisabled?.[inputRef?.current?.id]}
      >
        {defaultLabel}
      </Button>
    </Scroll>
  );
}
