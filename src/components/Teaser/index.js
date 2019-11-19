import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { t } = useTranslation('teaser');
  const title = t('title');

  return (
    <div children={title}
         className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle(2)}
         title={title} />
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
