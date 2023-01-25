import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';
import { useCallback, useMemo, useState } from 'react';

import FileUploadButton from '../FileUploadButton';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';
import { useUploadFile } from '../../contexts/UploadFileContext';

const UploadInput = () => {
  const { fileSelected, handleCancel, showConfirmSelectedFile, validateFile, errorFormatMessage } = useUploadFile();
  const fileName = useMemo(() => fileSelected?.name || '', [fileSelected]);

  const formatFileSize = (file) => Math.ceil(file?.size / Math.pow(1024, 1));

  const rendererHeader = () => {
    validateFile(fileSelected);
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

  const label = useMemo(() => (!errorFormatMessage ? 'Send' : 'Reupload'), [errorFormatMessage]);

  const renderAction = () => {
    return !errorFormatMessage ? <SendButton title={label} /> : <FileUploadButton label={label} keepActive />;
  };

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
