import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';
import React, { useContext } from 'react';

import { DialogContext } from '../../contexts/DialogContext';

const UploadInput = () => {
  const { selectedFile, setSelectedFile, setIsFileActive, errorFormatMessage, setErrorFormatMessage } =
    useContext(DialogContext);
  const name = selectedFile?.name;
  const size = selectedFile?.size;
  const sizeFormat = Math.ceil(size / Math.pow(1024, 1));

  const handleCancel = () => {
    setSelectedFile(null);
    setIsFileActive(false);
    setErrorFormatMessage(null);
  };

  const rendererHeader = () => {
    if (errorFormatMessage) {
      return <ErrorMessage>{errorFormatMessage}</ErrorMessage>;
    } else {
      return (
        <>
          <span className="overflow-hidden name-file">{name} </span>
          <span className="overflow-hidden size-file">{sizeFormat} ko</span>
        </>
      );
    }
  };
  const labelBtnUpload = errorFormatMessage ? 'Reupload' : 'Send';
  return (
    <FileUploadContainer>
      {rendererHeader()}
      <div className="container-btns">
        <Button cancel title="Cancel" onClick={handleCancel}>
          Cancel
        </Button>
        <Button send title={labelBtnUpload}>
          {labelBtnUpload}
        </Button>
      </div>
    </FileUploadContainer>
  );
};

export default UploadInput;
