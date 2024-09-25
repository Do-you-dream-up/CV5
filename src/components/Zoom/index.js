import PropTypes from 'prop-types';
import useStyles from './styles';
import { useDialog } from '../../contexts/DialogContext';

const Zoom = ({ src }) => {
  const classes = useStyles();
  const { setZoomSrc } = useDialog();

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
