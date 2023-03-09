import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';

import FileUploadButton from '../FileUploadButton/FileUploadButton';
import Scroll from '../Scroll/Scroll';
import c from 'classnames';
import dydu from 'src/tools/dydu';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

interface SendButtonProps {
  title: string;
  onClick: any;
}

const UploadInput = () => {
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration });
  const { t } = useTranslation('translation');
  const { fileSelected, handleCancel, errorFormatMessage, isUploadFileSent, fileName } = useUploadFile();

  const formatFileSize = (file) => Math.ceil(file?.size / Math.pow(1024, 1));
  const label = useMemo(
    () => (!errorFormatMessage ? t('input.actions.send') : t('input.actions.reupload')),
    [errorFormatMessage],
  );

  const SendButton = ({ title, onClick }: SendButtonProps) => (
    <Button send title={title} onClick={() => onClick()}>
      {title}
    </Button>
  );

  const sendFile = (file) => {
    isUploadFileSent && isUploadFileSent();
    return dydu.sendUpoadFile(file);
  };

  const renderAction = () =>
    !errorFormatMessage ? (
      <div>
        <SendButton title={label} onClick={() => sendFile(fileSelected)} />
      </div>
    ) : (
      <FileUploadButton label={label} />
    );

  const renderFileInfo = () =>
    isDefined(fileSelected) && (
      <>
        <span className="overflow-hidden name-file">{fileName} </span>
        <span className="overflow-hidden size-file">{formatFileSize(fileSelected)} ko</span>
        {errorFormatMessage && <ErrorMessage>{errorFormatMessage}</ErrorMessage>}
      </>
    );

  const rendererButtons = () => (
    <div className="container-btns">
      <div>
        <Button cancel title={t('close.no')} onClick={() => handleCancel?.()}>
          {t('close.no')}
        </Button>
      </div>
      {renderAction()}
    </div>
  );

  return (
    <Scroll className={c('upload-input', classes.root)}>
      <FileUploadContainer data-testid="footer-upload-input">
        {renderFileInfo()}
        {rendererButtons()}
      </FileUploadContainer>
    </Scroll>
  );
};

export default UploadInput;
