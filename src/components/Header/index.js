import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import { DragonContext } from '../../contexts/DragonContext';
import { ModalContext } from '../../contexts/ModalContext';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import useViewport from '../../tools/hooks/viewport';
import { Local } from '../../tools/storage';
import { ACTIONS } from '../../tools/talk';
import Actions from '../Actions';
import Banner from '../Banner';
import ModalFooterMenu from '../ModalFooterMenu';
import Skeleton from '../Skeleton';
import Tabs from '../Tabs';
import useStyles from './styles';
const images = localStorage.getItem('dydu.images');

/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
export default function Header({ dialogRef, extended, gdprRef, minimal, onClose, onExpand, onMinimize, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { onDragStart } = useContext(DragonContext) || {};
  const { modal } = useContext(ModalContext);
  const { active: onboardingActive } = useContext(OnboardingContext) || {};
  const { typeResponse } = useContext(DialogContext);
  const onboardingEnable = configuration.onboarding.enable;
  const dragonZone = useRef();
  const classes = useStyles({configuration});
  const theme = useTheme();
  const { ready, t } = useTranslation('translation');
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { actions: hasActions = {} } = configuration.header;
  const { customAvatar, image: hasImage, imageLink, title: hasTitle } = configuration.header.logo;
  const { factor, maxFontSize, minFontSize } = configuration.header.fontSizeChange;
  const actionClose = t('header.actions.close');
  const actionExpand = t('header.actions.expand');
  const actionMinimize = t('header.actions.minimize');
  const actionMore = t('header.actions.more');
  const actionShrink = t('header.actions.shrink');
  const actionTests = t('header.actions.tests');
  const actionFontIncrease = t('header.actions.fontIncrease');
  const actionFontDecrease = t('header.actions.fontDecrease');
  const [fontSize, setFontSize] = useState(1);
  const gdprPassed = Local.get(Local.names.gdpr);
  const singleTab = !configuration.tabs.hasContactTab;
  const logo = images && JSON.parse(images) && JSON.parse(images).logo;

  const onToggleMore = () => {
    modal(ModalFooterMenu, null, {variant: 'bottom'}).then(() => {}, () => {});
  };

  const changeFontSize = useCallback((option) => {
    if (option === 'increase') {
      fontSize < maxFontSize ? setFontSize(fontSize + factor) : null;
    }
    else if ((option === 'decrease')) {
      fontSize > minFontSize ? setFontSize(fontSize - factor) : null;
    }
  }, [factor, fontSize, maxFontSize, minFontSize]);


  useEffect(() => {
    if (Local.get(Local.names.fontSize)) {
      setFontSize(Local.get(Local.names.fontSize));
    }
  }, []);

  useEffect(() => {
    if (gdprRef.current && !gdprPassed && !!hasActions.fontChange) {
      gdprRef.current.style.fontSize = `${fontSize}em`;
      Local.set(Local.names.fontSize, fontSize);
    }
    else if (dialogRef.current && gdprPassed && !!hasActions.fontChange) {
      dialogRef.current.style.fontSize = `${fontSize}em`;
      Local.set(Local.names.fontSize, fontSize);
    }
  }, [dialogRef, gdprPassed, gdprRef, fontSize, changeFontSize, hasActions.fontChange]);

  const RE_UNDERSTOOD = /^(DMUnderstoodQuestion|DMRewordClickedAuto)$/g;
  const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
  const RE_MISUNDERSTOOD = /^(GB)((TooMany)?)(MisunderstoodQuestion)(s?)$/g;

  const imageType = !customAvatar ? imageLink.default :
                    typeResponse && typeResponse.match(RE_UNDERSTOOD) ?
                    imageLink.understood :
                    typeResponse && typeResponse.match(RE_MISUNDERSTOOD) ?
                    imageLink.misunderstood :
                    typeResponse && typeResponse.match(RE_REWORD) ?
                    imageLink.reword :
                    imageLink.default;

  const testsMenu = [Object.keys(ACTIONS).map(it => ({
    onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
    text: it,
  }))];

  const actions = [
    {
      children: <img alt={actionTests} src={`${process.env.PUBLIC_URL}icons/dydu-dots-vertical-white.svg`} title={actionTests} />,
      items: () => testsMenu,
      variant: 'icon',
      when: !!hasActions.tests && !onboardingActive && testsMenu.flat().length > 0,
    },
    {
      children: <img alt={actionMore} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.more}`} title={actionMore} />,
      onClick: onToggleMore,
      variant: 'icon',
      when: !!hasActions.more && !!gdprPassed && (!onboardingActive || !onboardingEnable),
    },
    {
      children: <img alt={actionFontIncrease} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.fontIncrease}`} title={actionFontIncrease} />,
      disabled: fontSize >= maxFontSize,
      onClick: () => changeFontSize('increase'),
      variant: 'icon',
      when: !!hasActions.fontChange,
    },
    {
      children: <img alt={actionFontDecrease} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.fontDecrease}`} title={actionFontDecrease} />,
      disabled: fontSize <= minFontSize,
      onClick: () => changeFontSize('decrease'),
      variant: 'icon',
      when: !!hasActions.fontChange,
    },
    {
      children: <img alt={actionExpand} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.expand}`} title={actionExpand} />,
      onClick: () => onExpand(true)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && !extended,
    },
    {
      children: <img alt={actionShrink} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.collapse}`} title={actionShrink} />,
      onClick: () => onExpand(false)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && extended,
    },
    {
      children: <img alt={actionMinimize} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.minimize}`} title={actionMinimize} />,
      onClick: onMinimize,
      variant: 'icon',
      when: !!hasActions.minimize,
    },
    {
      children: <img alt={actionClose} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.close}`} title={actionClose} />,
      onClick: onClose,
      variant: 'icon',
      when: !!hasActions.close,
    }
  ];

  return (
    <header className={c('dydu-header', classes.root, {[classes.flat]: minimal})} {...rest}>
      <div className={c('dydu-header-body', classes.body, {[classes.draggable]: onDragStart})}
           onMouseDown={onDragStart && onDragStart(dragonZone)}
           ref={dragonZone}>
        <div className={c('dydu-header-logo', classes.logo)}>
          {!!hasImage && (
            <div className={c('dydu-header-image', classes.image)}>
              <img alt='avatar' src={logo || `${process.env.PUBLIC_URL}assets/${imageType}`} />
            </div>
          )}
          {!!hasTitle && (
            <div className={c('dydu-header-title', classes.title)}>
              <Skeleton children={t('header.title')} hide={!ready} variant="text" width="6em" />
            </div>
          )}
        </div>
        <Actions actions={actions} className={c('dydu-header-actions', classes.actions)} />
      </div>
      {!minimal && (
        <>
          {!singleTab && <Tabs />}
          <Banner />
        </>
      )}
    </header>
  );
}

Header.propTypes = {
  dialogRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  extended: PropTypes.bool,
  gdprRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  minimal: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExpand: PropTypes.func,
  onMinimize: PropTypes.func.isRequired,
  style: PropTypes.object,
};
