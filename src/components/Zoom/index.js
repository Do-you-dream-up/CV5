import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useStyles from './styles';
import { useDialog } from '../../contexts/DialogContext';
import { useTranslation } from 'react-i18next';

const Zoom = ({ src }) => {
  const classes = useStyles();
  const { setZoomSrc } = useDialog();
  const { t } = useTranslation('translation');

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
      <img src={src} className={classes.image} onClick={closeZoom} alt={t('zoom.close')} />
    </div>
  );
};

export default Zoom;

Zoom.propTypes = {
  src: PropTypes.string,
};
