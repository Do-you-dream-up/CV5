/* eslint-disable */
import PropTypes from 'prop-types';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import useUploadFile from 'src/tools/hooks/useUploadFile';

function UploadFileTemplate({ accept = '.png, .jpg, .svg, .pdf' }) {
  const { configuration } = useConfiguration();

  const { inputRef, changeHandler, uploadActive, isFileActive } = useUploadFile();

  const classes = useStyles({ configuration });
  return uploadActive ? (
    // <div className={c('dydu-input-field', classes.field, isFileActive && classes.disable)}>
    //   <input
    //     accept={accept}
    //     id="input-file"
    //     type="file"
    //     disabled={isFileActive}
    //     hidden
    //     onChange={changeHandler}
    //     ref={inputRef}
    //   />
    //   <label className={c('dydu-input-label', classes.label)} htmlFor="input-file">
    //     Upload file
    //   </label>
    // </div>
    <useUploadFile accept={accept} />
  ) : null;
}

UploadFileTemplate.propTypes = {
  accept: PropTypes.array,
};

export default UploadFileTemplate;
