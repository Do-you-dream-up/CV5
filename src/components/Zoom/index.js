import { DialogContext } from '../../contexts/DialogContext';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import useStyles from './styles';

const Zoom = ({ src }) => {
  const classes = useStyles();
  const { setZoomSrc } = useContext(DialogContext);

  const closeZoom = () => setZoomSrc(null);

  return (
    <div className={classes.zoom} onClick={closeZoom}>
      <img src={src} className={classes.image} onClick={closeZoom} alt="closeZoom" />
    </div>
  );
};

export default Zoom;

Zoom.propTypes = {
  src: PropTypes.string,
};
