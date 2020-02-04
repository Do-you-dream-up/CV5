import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('teaser');
  const title = t('title');

  return (
    <div className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle(2)}
         title={title}>
      <div className={c('dydu-teaser-button', classes.button)}>
        <Skeleton children={title} hide={!ready} width="3em" />
      </div>
      <div className={c('dydu-teaser-brand', classes.brand)}>
        <img alt={title} src="assets/dydu.png" />
      </div>
    </div>
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
