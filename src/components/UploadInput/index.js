import { Button, ErrorMessage, FileUploadContainer } from '../../styles/styledComponent';
import { useUploadFile } from '../../contexts/UploadFileContext';
import FileUploader from '../FileUploader';

const UploadInput = () => {
  const { file, flush, errorFormatMessage = false } = useUploadFile();
  const name = file?.name;
  const size = file?.size;
  const sizeFormat = Math.ceil(size / Math.pow(1024, 1));

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
        <Button cancel title="Cancel" onClick={flush}>
          Cancel
        </Button>
        {labelBtnUpload === 'Send' ? (
          <Button send title={labelBtnUpload}>
            {labelBtnUpload}
          </Button>
        ) : (
          <FileUploader />
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
