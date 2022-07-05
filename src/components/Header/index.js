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
import AvatarsMatchingRequest from '../AvatarsMatchingRequest';

/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
export default function Header({ dialogRef, extended, gdprRef, minimal, onClose, onExpand, onMinimize, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const { onDragStart } = useContext(DragonContext) || {};
  const { modal } = useContext(ModalContext);
  const { active: onboardingActive } = useContext(OnboardingContext) || {};
  const onboardingEnable = configuration.onboarding.enable;
  const dragonZone = useRef();
  const classes = useStyles({ configuration });
  const theme = useTheme();
  const { ready, t } = useTranslation('translation');
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { actions: hasActions = {} } = configuration.header;
  const { image: hasImage, title: hasTitle } = configuration.header.logo;
  const defaultAvatar = configuration.avatar?.response?.image;
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
  const { exportConversation, printConversation: _printConversation, sendGdprData } = configuration.moreOptions;
  const { interactions, typeResponse } = useContext(DialogContext);
  const { enable: disclaimerEnable } = configuration.gdprDisclaimer;

  const onToggleMore = () => {
    modal(ModalFooterMenu, null, { variant: 'bottom' }).then(
      () => {},
      () => {},
    );
  };

  const changeFontSize = useCallback(
    (option) => {
      if (option === 'increase') {
        fontSize < maxFontSize ? setFontSize(fontSize + factor) : null;
      } else if (option === 'decrease') {
        fontSize > minFontSize ? setFontSize(fontSize - factor) : null;
      }
    },
    [factor, fontSize, maxFontSize, minFontSize],
  );

  useEffect(() => {
    if (Local.get(Local.names.fontSize)) {
      setFontSize(Local.get(Local.names.fontSize));
    }
  }, []);

  useEffect(() => {
    if (gdprRef.current && !gdprPassed && !!hasActions.fontChange) {
      gdprRef.current.style.fontSize = `${fontSize}em`;
      Local.set(Local.names.fontSize, fontSize);
    } else if (dialogRef.current && gdprPassed && !!hasActions.fontChange) {
      dialogRef.current.style.fontSize = `${fontSize}em`;
      Local.set(Local.names.fontSize, fontSize);
    }
  }, [dialogRef, gdprPassed, gdprRef, fontSize, changeFontSize, hasActions.fontChange]);

  const checkDisplayParametersInMoreOptionsCog = useCallback(() => {
    if (disclaimerEnable === false || gdprPassed) {
      return (
        (!!exportConversation || (interactions.length > 1 && !!_printConversation) || !!sendGdprData) &&
        (!onboardingActive || !onboardingEnable)
      );
    } else {
      return false;
    }
  }, [
    _printConversation,
    disclaimerEnable,
    exportConversation,
    gdprPassed,
    interactions.length,
    onboardingActive,
    onboardingEnable,
    sendGdprData,
  ]);

  const testsMenu = [
    Object.keys(ACTIONS).map((it) => ({
      onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, { hide: true })),
      text: it,
    })),
  ];

  const actions = [
    {
      children: <img alt={actionTests} src={`${process.env.PUBLIC_URL}icons/dydu-dots-vertical-white.svg`} />,
      items: () => testsMenu,
      variant: 'icon',
      when: !!hasActions.tests && !onboardingActive && testsMenu.flat().length > 0,
      title: actionTests,
    },
    {
      children: <img alt={actionMore} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.more}`} />,
      onClick: onToggleMore,
      variant: 'icon',
      when: checkDisplayParametersInMoreOptionsCog(),
      title: actionMore,
    },
    {
      children: (
        <img
          alt={actionFontIncrease}
          src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.fontIncrease}`}
        />
      ),
      disabled: fontSize >= maxFontSize,
      onClick: () => changeFontSize('increase'),
      variant: 'icon',
      when: !!hasActions.fontChange,
      title: actionFontIncrease,
    },
    {
      children: (
        <img
          alt={actionFontDecrease}
          src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.fontDecrease}`}
        />
      ),
      disabled: fontSize <= minFontSize,
      onClick: () => changeFontSize('decrease'),
      variant: 'icon',
      when: !!hasActions.fontChange,
      title: actionFontDecrease,
    },
    {
      children: <img alt={actionExpand} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.expand}`} />,
      onClick: () => onExpand(true)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && !extended,
      title: actionExpand,
    },
    {
      children: (
        <img alt={actionShrink} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.collapse}`} />
      ),
      onClick: () => onExpand(false)(),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && extended,
      title: actionShrink,
    },
    {
      children: (
        <img alt={actionMinimize} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.minimize}`} />
      ),
      onClick: onMinimize,
      variant: 'icon',
      when: !!hasActions.minimize,
      title: actionMinimize,
    },
    {
      children: <img alt={actionClose} src={`${process.env.PUBLIC_URL}icons/${configuration.header.icons.close}`} />,
      onClick: onClose,
      variant: 'icon',
      when: !!hasActions.close,
      title: actionClose,
    },
  ];

  return (
    <div className={c('dydu-header', classes.root, { [classes.flat]: minimal })} {...rest}>
      <div
        className={c('dydu-header-body', classes.body, {
          [classes.draggable]: onDragStart,
        })}
        onMouseDown={onDragStart && onDragStart(dragonZone)}
        ref={dragonZone}
      >
        <div className={c('dydu-header-logo', classes.logo)}>
          {!!hasImage && (
            <div className={c('dydu-header-image', classes.image)}>
              <AvatarsMatchingRequest
                typeResponse={typeResponse}
                headerAvatar={true}
                defaultAvatar={defaultAvatar}
                type={''}
              />
            </div>
          )}
          {!!hasTitle && (
            <h1 className={c('dydu-header-title', classes.title)}>
              <Skeleton children={t('header.title')} hide={!ready} variant="text" width="6em" />
            </h1>
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
    </div>
  );
}

Header.propTypes = {
  dialogRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  extended: PropTypes.bool,
  gdprRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  minimal: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExpand: PropTypes.func,
  onMinimize: PropTypes.func.isRequired,
  style: PropTypes.object,
};
