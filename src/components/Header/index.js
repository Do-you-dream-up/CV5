import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonContext } from '../../contexts/DragonContext';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { ACTIONS } from '../../tools/talk';
import Actions from '../Actions';
import Banner from '../Banner';
import Onboarding from '../Onboarding';
import Skeleton from '../Skeleton';
import Tabs from '../Tabs';
import useStyles from './styles';


/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
export default function Header({ onClose, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { onDragStart } = useContext(DragonContext) || {};
  const { active: onboardingActive } = useContext(OnboardingContext) || {};
  const dragonZone = useRef();
  const classes = useStyles({configuration});
  const [ t, i, ready ] = useTranslation('header');
  const { languages = [] } = configuration.application;
  const { title: hasTitle } = configuration.header;
  const { active: spacesActive, items: spaces = [] } = configuration.spaces;
  const actionClose = t('actions.close');
  const actionGdpr = t('actions.gdpr');
  const actionMore = t('actions.more');
  const actionRosetta = t('actions.rosetta');
  const actionSpaces = t('actions.spaces');

  const languagesMenu = [languages.sort().map(id => ({
    id,
    onClick: () => window.dydu && window.dydu.localization && window.dydu.localization.set(id),
    text: t(`rosetta.${id}`),
  }))];

  const moreMenu = [Object.keys(ACTIONS).map(it => ({
    onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
    text: it,
  }))];

  const spacesMenu = [spaces.map(it => ({
    id: it.toLowerCase(),
    onClick: () => window.dydu.space.set(it),
    text: it,
  }))];

  const onGdpr = () => window.dydu.gdpr();

  const actions = [
    {
      children: <img alt={actionSpaces} src="icons/database.png" title={actionSpaces} />,
      items: () => spacesMenu,
      selected: () => window.dydu.space.get(),
      variant: 'icon',
      when: spacesActive && !onboardingActive && spacesMenu.flat().length > 0,
    },
    {
      children: <img alt={actionRosetta} src="icons/flag.png" title={actionRosetta} />,
      items: () => languagesMenu,
      selected: () => i.languages[0],
      variant: 'icon',
      when: languagesMenu.flat().length > 1,
    },
    {
      children: <img alt={actionGdpr} src="icons/shield-lock.png" title={actionGdpr} />,
      onClick: onGdpr,
      variant: 'icon',
      when: !onboardingActive,
    },
    {
      children: <img alt={actionMore} src="icons/dots-vertical.png" title={actionMore} />,
      items: () => moreMenu,
      variant: 'icon',
      when: !onboardingActive && moreMenu.flat().length > 0,
    },
    {
      children: <img alt={actionClose} src="icons/close.png" title={actionClose} />,
      onClick: onClose,
      variant: 'icon',
    },
  ];

  return (
    <header className={c('dydu-header', classes.root)} {...rest}>
      <div className={c('dydu-header-body', classes.body, {[classes.draggable]: onDragStart})}
           onMouseDown={onDragStart && onDragStart(dragonZone)}
           ref={dragonZone}>
        {!!hasTitle && (
          <div className={c('dydu-header-title', classes.title)}>
            <Skeleton children={t('title')} hide={!ready} variant="text" width="6em" />
          </div>
        )}
        <Actions actions={actions} className={c('dydu-header-actions', classes.actions)} />
      </div>
      <Onboarding>
        <Tabs />
        <Banner />
      </Onboarding>
    </header>
  );
}

Header.propTypes = {
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
};
