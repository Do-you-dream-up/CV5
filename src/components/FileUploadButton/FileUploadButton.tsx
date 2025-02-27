import { documentCreateElement, isDefined } from '../../tools/helpers';
import {useCallback, useMemo, useRef} from 'react';

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
  id?: any;
}


export default function FileUploadButton({ label, id }: FileUploadButtonProps) {
  const [t] = useTranslation('translation');
  const { onSelectFile, extractFileFromEvent, isFileSent } = useUploadFile();
  const defaultLabel = useMemo(() => label || t('uploadFile.label'), [label]);
  const disableButton = useMemo(() => isFileSent[id], [isFileSent[id]]);
  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });

  const inputId = useId();

  const processUserFileSelection = useCallback(
    (file) => {
      try {
        onSelectFile?.(file);
      } catch (e) {
        console.error('While handling file selection', e);
      }
    },
    [onSelectFile],
  );

  const onSelect = useCallback(
    (event) => {
      const file = extractFileFromEvent?.(event);
      const hasUserCanceledFileSelection = !isDefined(file?.name);
      if (hasUserCanceledFileSelection) {
        throw new Error('error while cancel selection');
      }
      processUserFileSelection(file);
    },
    [defaultLabel, onSelectFile, processUserFileSelection],
  );

  const openFileonClick = useCallback(() => {
    const input = documentCreateElement('input', { id: inputId, type: 'file', hidden: 'true' });
    input.onchange = onSelect;
    input.click();
  }, [onSelect]);

  return (
    <Scroll>
      <Button
        className={classes.upload}
        data-testid="file-upload-button"
        onClick={openFileonClick}
        disabled={disableButton}
        id={id}
      >
        {defaultLabel}
      </Button>
    </Scroll>
  );
}
