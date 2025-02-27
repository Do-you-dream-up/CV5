import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';

import FileUploadButton from '../FileUploadButton/FileUploadButton';
import Scroll from '../Scroll/Scroll';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo, useState } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';
import {useDialog} from "../../contexts/DialogContext";

interface SendButtonProps {
  title: string;
  onClick: any;
  className: any;
  isClicked: boolean;
}

const SendButton = ({ title, onClick, className, isClicked }: SendButtonProps) => (
  <Button
    title={title}
    onClick={() => {
      onClick();
    }}
    className={className}
    disabled={isClicked}
  >
    {title}
  </Button>
);

const UploadInput = () => {
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration });
  const { t } = useTranslation('translation');
  const { fileUploadButtonId } = useDialog();
  const { fileSelected, handleCancel, errorFormatMessage, fileName, setIsFileUploadSuccess, setIsFileSent, isFileSent } = useUploadFile();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const formatFileSize = (file) => Math.ceil(file?.size / Math.pow(1024, 1));
  const label = useMemo(
    () => (!errorFormatMessage ? t('uploadFile.send') : t('input.actions.reupload')),
    [errorFormatMessage],
  );

  const sendFile = (file) => {
    return dydu
      .sendUploadFile(file)
      .then((success) => {
        if (success) {
          setIsFileUploadSuccess(true);
          setIsFileSent && setIsFileSent({ ...isFileSent, [fileUploadButtonId]: true });
        } else {
          handleCancel?.();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderAction = () =>
    !errorFormatMessage ? (
      <div>
        <SendButton
          title={label}
          onClick={() => {
            sendFile(fileSelected);
            setIsClicked(true);
          }}
          className={classes.sendfile}
          isClicked={isClicked}
        />
      </div>
    ) : (
      <FileUploadButton disabled={false} label={label}/>
    );

  const renderFileInfo = () =>
    isDefined(fileSelected) && (
      <>
        <span className={c(classes.color, 'name-file')}>{fileName} </span>
        <span className="overflow-hidden size-file">{formatFileSize(fileSelected)} ko</span>
        {errorFormatMessage && <ErrorMessage>{errorFormatMessage}</ErrorMessage>}
      </>
    );

  const rendererButtons = () => (
    <div className="container-btns">
      <div>
        <Button cancel className={classes.cancel} title={t('close.no')} onClick={() => handleCancel?.()}>
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
