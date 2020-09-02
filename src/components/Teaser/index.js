import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { EventsContext } from '../../contexts/EventsContext';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {

  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('teaser');
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('teaser');
  const title = t('title');
  const hideTeaser = configuration.teaser.hide;

  const onClick = () => {
    event('onClick', 1, 2, 4, 'asdf');
    toggle(2)();
  };

  return ( !hideTeaser &&
    <div className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={onClick}
         title={title}
         role='button'
         tabIndex='0.2'
         aria-pressed={!open}>
      <div className={c('dydu-teaser-button', classes.button)}>
        <Skeleton children={title} hide={!ready} width="3em" />
      </div>
      <div className={c('dydu-teaser-brand', classes.brand)}>
        <img alt={title} src={`assets/${configuration.avatar.icon}`} />
      </div>
    </div>
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
