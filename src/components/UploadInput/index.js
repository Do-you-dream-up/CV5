import React, { useContext } from 'react';

import Button from '../Button';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import c from 'classnames';
import useStyles from './styles';

const UploadInput = () => {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { selectedFile, setSelectedFile, setIsFileActive } = useContext(DialogContext);
  const { name, size } = selectedFile;
  const sizeFormat = Math.ceil(size / Math.pow(1024, 1));

  const handleCancel = () => {
    setSelectedFile(null);
    setIsFileActive(false);
  };
  return (
    <div className={c('dydu-input-field', classes.field)}>
      <span>{name}</span>
      <span>{sizeFormat} ko</span>
      <div className={c('dydu-container-btns', classes.containerBtns)}>
        <Button title="Cancel" onClick={handleCancel}>
          Cancel
        </Button>
        <Button title="Send">Send</Button>
      </div>
    </div>
  );
};

export default UploadInput;
