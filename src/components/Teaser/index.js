import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';
import Skeleton from '../Skeleton';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { t, ready } = useTranslation('teaser');
  const title = t('title');

  return (
    <div className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle(2)}
         title={title}>
      <Skeleton children={title} hide={!ready} width="3em" />
    </div>
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
