import React, { useContext, useEffect, useRef } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import c from 'classnames';
import useStyles from './styles';

function UploadFileTemplate() {
  const { configuration } = useContext(ConfigurationContext);
  const { setSelectedFile, selectedFile, isFileActive, setIsFileActive, setErrorFormatMessage } =
    useContext(DialogContext);
  const inputRef = useRef();

  useEffect(() => {
    if (!selectedFile) {
      inputRef.current.value = '';
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
  const classes = useStyles({ configuration });
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
    <div className={c('dydu-input-field', classes.field, isFileActive && classes.disable)}>
      <input
        accept=".png, .jpg, .svg, .pdf"
        id="input-file"
        type="file"
        disabled={isFileActive}
        hidden
        onChange={changeHandler}
        ref={inputRef}
      />
      <label className={c('dydu-input-label', classes.label)} htmlFor="input-file">
        Upload file
      </label>
    </div>
  );
}

export default UploadFileTemplate;
