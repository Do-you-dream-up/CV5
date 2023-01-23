import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { isDefined } from '../helpers';

const useUploadFile = ({ accept, disableOnSelection = false, label, inputId = 'myinputid', ...htmlInputRootProps }) => {
  const [selectedFile, setSelectedFile] = useState(false);
  const setIsFileActive = useState(false);
  const setErrorFormatMessage = '';

  const inputRef = useRef();

  useEffect(() => {
    if (!selectedFile) {
      if (isDefined(inputRef.current)) inputRef.current.value = '';
    }
  }, [selectedFile]);
  const allowedFormat = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
  ];
  return (
    <>
      <input
        onChange={changeHandler}
        id={inputId}
        {...htmlInputRootProps}
        onSelect={selectedFile}
        disabled={disableOnSelection}
        hidden
        type="file"
        accept={accept}
      />
      <label htmlFor={inputId}>{label}</label>
    </>
  );
};
useUploadFile.propTypes = {
  accept: PropTypes.array,
  disableOnSelection: PropTypes.boolean,
  label: PropTypes.string,
  inputId: PropTypes.string,
};
export default useUploadFile;
