import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';
import React, { useCallback, useContext, useState } from 'react';

import { DialogContext } from '../../contexts/DialogContext';
import UploadFileTemplate from '../UploadFileTemplate';
import UseUploadFile from 'src/tools/hooks/useUploadFile';

const UploadInput = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileActive, setIsFileActive] = useState(false);
  const [errorFormatMessage, setErrorFormatMessage] = useState(null);
  const handleSelectFile = useCallback((filename) => {
    console.log('selected file ', filename);
  }, []);
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

  const rendererButtons = () => {
    return (
      <div className="container-btns">
        <Button cancel title="Cancel" onClick={handleCancel}>
          Cancel
        </Button>
        {labelBtnUpload === 'Send' ? (
          <Button send title={labelBtnUpload}>
            {labelBtnUpload}
          </Button>
        ) : (
          <UseUploadFile onSelect={handleSelectFile} disabled={false} label="coucou" />
        )}
      </div>
    );
  };
  const labelBtnUpload = errorFormatMessage ? 'Reupload' : 'Send';
  return (
    <FileUploadContainer>
      {rendererHeader()}
      {rendererButtons()}
    </FileUploadContainer>
  );
};

export default UploadInput;
