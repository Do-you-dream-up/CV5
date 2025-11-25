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
import { useDialog } from '../../contexts/DialogContext';

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
  const { selectedFiles, handleCancel, invalidSelectedFilesMessage, setIsFilesUploadSuccess } = useUploadFile();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const label = useMemo(() => {
    const sendMessage = selectedFiles.length > 1 ? t('uploadFiles.send') : t('uploadFile.send');
    const reuploadMessage = selectedFiles.length > 1 ? t('input.actions.reuploads') : t('input.actions.reupload');
    return !invalidSelectedFilesMessage ? sendMessage : reuploadMessage;
  }, [invalidSelectedFilesMessage]);

  const sendFiles = (files: File[]) => {
    return dydu
      .sendFiles(files)
      .then((success) => {
        if (success) {
          setIsFilesUploadSuccess(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderAction = () =>
    !invalidSelectedFilesMessage ? (
      <div>
        <SendButton
          title={label}
          onClick={() => {
            if (selectedFiles.length <= 5) {
              sendFiles(selectedFiles);
              setIsClicked(true);
            }
          }}
          className={classes.upload}
          isClicked={isClicked}
        />
      </div>
    ) : (
      <FileUploadButton disabled={false} label={label} />
    );

  const renderFileInfo = () =>
    isDefined(selectedFiles) && (
      <>
        <span className={c(classes.color, 'name-file')}>
          {selectedFiles
            .map(function (f) {
              return f.name;
            })
            .join(', ')}{' '}
        </span>
        {/*<span className="overflow-hidden size-file">{formatFileSize(selectedFiles)} ko</span>*/}
        {invalidSelectedFilesMessage && <ErrorMessage>{invalidSelectedFilesMessage}</ErrorMessage>}
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
