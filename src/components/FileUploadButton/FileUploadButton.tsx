import { documentCreateElement } from '../../tools/helpers';
import { useMemo, useRef } from 'react';

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
  const { isFileSent } = useUploadFile();
  const defaultLabel = useMemo(() => label || t('uploadFiles.label'), [label]);

  const disableButton = useMemo(() => isFileSent[id], [isFileSent[id]]);

  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });

  const { onSelectFiles, buttonIdDisabled, setButtonIdDisabled, allowedFormatExtensions } = useUploadFile();

  const inputId = useId();

  const inputRef = useRef<HTMLInputElement | null>(null);

  function onSelect(event) {
    setButtonIdDisabled && setButtonIdDisabled({ ...buttonIdDisabled, [inputRef.current.id]: true });
    onSelectFiles && onSelectFiles(event, inputRef);
  }

  function openFileOnClick() {
    const input = documentCreateElement('input', {
      id: inputId,
      type: 'file',
      hidden: 'true',
      multiple: 'true',
      accept: allowedFormatExtensions.join(', '),
    });

    input.onchange = onSelect;
    inputRef.current = input;

    input.click();
  }

  return (
    <Scroll>
      <Button
        className={classes.upload}
        data-testid="file-upload-button"
        onClick={openFileOnClick}
        disabled={disableButton || buttonIdDisabled?.[inputId]}
        id={id}
      >
        {defaultLabel}
      </Button>
    </Scroll>
  );
}
