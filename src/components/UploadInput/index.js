import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';
import { useCallback, useMemo } from 'react';

import FileUploadButton from '../FileUploadButton';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';
import { useUploadFile } from '../../contexts/UploadFileContext';

const UploadInput = () => {
  const { file, handleCancel, isFileValid, showConfirmSelectedFile, errorFormatMessage = false } = useUploadFile();

  const fileName = useMemo(() => file?.name || '', [file]);
  const fileSize = useMemo(() => file?.size || '', [file]);

  const rendererHeader = useCallback(() => {
    if (!isDefined(file)) return null;
    if (errorFormatMessage) {
      return <ErrorMessage>{errorFormatMessage}</ErrorMessage>;
    } else {
      return (
        <>
          <span className="overflow-hidden name-file">{fileName} </span>
          <span className="overflow-hidden size-file">{formatFileSize(fileSize)} ko</span>
        </>
      );
    }
  }, [file]);

  const label = useMemo(() => (isFileValid() ? 'Send' : 'Reupload'), [isFileValid]);

  const renderAction = useCallback(() => {
    return isFileValid() ? <SendButton title={label} /> : <FileUploadButton label={label} keepActive />;
  }, [isFileValid, label]);

  const rendererButtons = () => {
    return (
      <div className="container-btns">
        <Button cancel title="Cancel" onClick={handleCancel}>
          Cancel
        </Button>
        {renderAction()}
      </div>
    );
  };

  if (!showConfirmSelectedFile) return null;
  return (
    <FileUploadContainer>
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

const formatFileSize = (file) => Math.ceil(file?.size / Math.pow(1024, 1));
