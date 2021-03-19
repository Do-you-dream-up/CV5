//import-voice
import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
// eslint-disable-next-line no-unused-vars
import { DialogContext } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { UserActionContext } from '../../contexts/UserActionContext';
// eslint-disable-next-line no-unused-vars
import { Local } from '../../tools/storage';
// eslint-disable-next-line no-unused-vars
import Actions from '../Actions';
import Skeleton from '../Skeleton';
import useStyles from './styles';

/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {
  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('teaser');
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('translation');
  const { tabbing } = useContext(UserActionContext) || false;
  const title = t('teaser.title');
  const mouseover = t('teaser.mouseover');
  const voice = configuration.Voice ? configuration.Voice.enable : false;

  const onClick = () => {
    event('onClick');
    toggle(2)();
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}>
      <div className={c('dydu-teaser-container', classes.dyduTeaserContainer)}>

        <div onClick={onClick}
             onKeyDown={onKeyDown}
             title={mouseover}
             role='button'
             tabIndex='0'
             aria-pressed={!open}
             className={c('dydu-teaser-title', classes.dyduTeaserTitle, {[classes.hideOutline]: !tabbing})}>
          <div className={c('dydu-teaser-button', classes.button)}>
            <Skeleton children={title} hide={!ready} width="3em" />
          </div>
          <div className={c('dydu-teaser-brand', classes.brand)}>
            <img alt={title} src={`${process.env.PUBLIC_URL}assets/${configuration.avatar.response}`} />
          </div>
        </div>
        { open && voice && <voice/> }
      </div>
    </div>
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
