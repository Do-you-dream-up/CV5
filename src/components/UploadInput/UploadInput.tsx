import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';

import FileUploadButton from '../FileUploadButton/FileUploadButton';
import dydu from 'src/tools/dydu';
import { isDefined } from '../../tools/helpers';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

interface SendButtonProps {
  title: string;
  onClick: any;
}

const UploadInput = () => {
  const { t } = useTranslation('translation');
  const no = t('close.no');
  const send = t('input.actions.send');
  const reupload = t('input.actions.reupload');
  const { fileSelected, handleCancel, validateFile, errorFormatMessage, IsUploadFileSended, isSended } =
    useUploadFile();
  const fileName = useMemo(() => fileSelected?.name || '', [fileSelected]);

  const formatFileSize = (file) => Math.ceil(file?.size / Math.pow(1024, 1));

  const rendererHeader = () => {
    validateFile && fileSelected && validateFile(fileSelected);
    if (!isDefined(fileSelected)) return null;

    if (errorFormatMessage) {
      return <ErrorMessage>{errorFormatMessage}</ErrorMessage>;
    } else {
      return (
        <>
          <span className="overflow-hidden name-file">{fileName} </span>
          <span className="overflow-hidden size-file">{formatFileSize(fileSelected)} ko</span>
        </>
      );
    }
  };

  const label = useMemo(() => (!errorFormatMessage ? send : reupload), [errorFormatMessage]);
  const SendButton = ({ title, onClick }: SendButtonProps) => (
    <Button send title={title} onClick={onClick}>
      {title}
    </Button>
  );

  const sendFile = (file) => {
    IsUploadFileSended && IsUploadFileSended();
    return dydu.sendUpoadFile(file);
  };

  const renderAction = () => {
    return !errorFormatMessage ? (
      <div>
        <SendButton title={label} onClick={() => sendFile(fileSelected)} />
      </div>
    ) : (
      <FileUploadButton label={label} keepActive />
    );
  };

  const rendererButtons = () => {
    return (
      <div className="container-btns">
        <div>
          <Button cancel title="Cancel" onClick={handleCancel}>
            {no}
          </Button>
        </div>
        {renderAction()}
      </div>
    );
  };

  return (
    <FileUploadContainer data-testid="footer-upload-input">
      {rendererHeader()}
      {rendererButtons()}
    </FileUploadContainer>
  );
};

export default UploadInput;
