import React, { useContext, useEffect, useRef } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import c from 'classnames';
import useStyles from './styles';

function UploadFileTemplate() {
  const { configuration } = useContext(ConfigurationContext);
  const { setSelectedFile, selectedFile, isFileActive, setIsFileActive } = useContext(DialogContext);
  const inputRef = useRef();

  useEffect(() => {
    if (!selectedFile) {
      inputRef.current.value = '';
    }
  }, [selectedFile]);

  const classes = useStyles({ configuration });
  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsFileActive(true);
  };

  return (
    <div className={c('dydu-input-field', classes.field, isFileActive && classes.disable)}>
      <input id="input-file" type="file" disabled={isFileActive} hidden onChange={changeHandler} ref={inputRef} />
      <label className={c('dydu-input-label', classes.label)} htmlFor="input-file">
        Upload file
      </label>
    </div>
  );
}

export default UploadFileTemplate;
