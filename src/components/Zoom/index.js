import { DialogContext } from '../../contexts/DialogContext';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import useStyles from './styles';

const Zoom = ({ src }) => {
  const classes = useStyles();
  const { setZoomSrc } = useContext(DialogContext);

  const closeZoom = () => setZoomSrc(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
