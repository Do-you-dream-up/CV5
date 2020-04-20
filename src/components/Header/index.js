import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonContext } from '../../contexts/DragonContext';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import useViewport from '../../tools/hooks/viewport';
import { ACTIONS } from '../../tools/talk';
import Actions from '../Actions';
import Banner from '../Banner';
import Skeleton from '../Skeleton';
import Tabs from '../Tabs';
import useStyles from './styles';


/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
export default function Header({ extended, minimal, onClose, onExpand, onMinimize, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { onDragStart } = useContext(DragonContext) || {};
  const { active: onboardingActive } = useContext(OnboardingContext) || {};
  const dragonZone = useRef();
  const classes = useStyles({configuration});
  const theme = useTheme();
  const [ t, i, ready ] = useTranslation('header');
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { languages = [] } = configuration.application;
  const { actions: hasActions = {}, title: hasTitle } = configuration.header;
  const actionClose = t('actions.close');
  const actionExpand = t('actions.expand');
  const actionMinimize = t('actions.minimize');
  const actionMore = t('actions.more');
  const actionRosetta = t('actions.rosetta');
  const actionShrink = t('actions.shrink');


  const languagesMenu = [languages.sort().map(id => ({
    id,
    onClick: () => window.dydu && window.dydu.localization && window.dydu.localization.set(id),
    text: t(`rosetta.${id}`),
  }))];

  const moreMenu = [Object.keys(ACTIONS).map(it => ({
    onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
    text: it,
  }))];

  const actions = [
    {
      children: <img alt={actionMore} src="icons/dots-vertical.png" title={actionMore} />,
      items: () => moreMenu,
      variant: 'icon',
      when: !!hasActions.more && !onboardingActive && moreMenu.flat().length > 0,
    },
    {
      children: <img alt={actionRosetta} src="icons/flag.png" title={actionRosetta} />,
      items: () => languagesMenu,
      selected: () => i.languages[0],
      variant: 'icon',
      when: !!hasActions.translate && languagesMenu.flat().length > 1,
    },
    {
      children: <img alt={actionExpand} src="icons/arrow-expand.png" title={actionExpand} />,
      onClick: () => onExpand(true)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && !extended,
    },
    {
      children: <img alt={actionShrink} src="icons/arrow-collapse.png" title={actionShrink} />,
      onClick: () => onExpand(false)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && extended,
    },
    {
      children: <img alt={actionMinimize} src="icons/window-minimize.png" title={actionMinimize} />,
      onClick: onMinimize,
      variant: 'icon',
      when: !!hasActions.minimize,
    },
    {
      children: <img alt={actionClose} src="icons/close.png" title={actionClose} />,
      onClick: onClose,
      variant: 'icon',
      when: !!hasActions.close,
    },
  ];

  return (
    <header className={c('dydu-header', classes.root, {[classes.flat]: minimal})} {...rest}>
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
      {!minimal && (
        <>
          <Tabs />
          <Banner />
        </>
      )}
    </header>
  );
}

Header.propTypes = {
  extended: PropTypes.bool,
  minimal: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExpand: PropTypes.func,
  onMinimize: PropTypes.func.isRequired,
  style: PropTypes.object,
};
