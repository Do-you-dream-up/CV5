import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { isDefined } from '../helpers';

const useUploadFile = ({
  accept,
  onSelect,
  disableOnSelection = false,
  children,
  label,
  inputId = 'myinputid',
  ...htmlInputRootProps
}) => {
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

  const changeHandler = (e) => {
    const sizeFormat = Math.ceil(e.target.files[0].size / Math.pow(1024, 1));
    const allowedFormatTargeted = allowedFormat.includes(e.target.files[0].type);
    if (allowedFormatTargeted && sizeFormat <= 7) {
      setSelectedFile(e.target.files[0]);
    } else if (!allowedFormatTargeted && sizeFormat > 7) {
      setErrorFormatMessage('Taille du document est trop élevé et format invalide ');
    } else if (!allowedFormatTargeted) {
      setErrorFormatMessage("Le format selectionné n'est pas autorisé");
    } else {
      setErrorFormatMessage('Taille du document est trop élevée');
    }
    setIsFileActive(true);
  };

  return (
    <>
      <input
        onChange={changeHandler}
        id={inputId}
        {...htmlInputRootProps}
        onSelect={selectedFile}
        disabled={disableOnSelection}
        label="coucou"
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
  onSelect: PropTypes.any,
  disableOnSelection: PropTypes.boolean,
  children: PropTypes.any,
  label: PropTypes.string,
  inputId: PropTypes.string,
};
export default useUploadFile;
