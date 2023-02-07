import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';

import FileUploadButton from '../FileUploadButton';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

const UploadInput = () => {
  const { t } = useTranslation('translation');
  const no = t('close.no');
  const send = t('input.actions.send');
  const reupload = t('input.actions.reupload');
  const { fileSelected, handleCancel, validateFile, errorFormatMessage } = useUploadFile();
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

  const renderAction = () => {
    return !errorFormatMessage ? <SendButton title={label} /> : <FileUploadButton label={label} keepActive />;
  };

  const rendererButtons = () => {
    return (
      <div className="container-btns">
        <Button cancel title="Cancel" onClick={handleCancel}>
          {no}
        </Button>
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

const SendButton = ({ title }) => (
  <Button send title={title}>
    {title}
  </Button>
);

SendButton.propTypes = {
  title: PropTypes.string.isRequired,
};
