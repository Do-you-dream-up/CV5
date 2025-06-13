import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ACTIONS } from '../../tools/talk';
import Actions from '../Actions/Actions';
import AvatarsMatchingRequest from '../AvatarsMatchingRequest/AvatarsMatchingRequest';
import Banner from '../Banner/Banner';
import { DragonContext } from '../../contexts/DragonContext';
import Icon from '../Icon/Icon';
import { Local } from '../../tools/storage';
import { ModalContext } from '../../contexts/ModalContext';
import ModalFooterMenu from '../ModalFooterMenu';
import { useOnboarding } from '../../contexts/OnboardingContext';
import PropTypes from 'prop-types';
import Skeleton from '../Skeleton';
import Tabs from '../Tabs/Tabs';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';
import { useUserAction } from '../../contexts/UserActionContext';
import useViewport from '../../tools/hooks/useViewport';
import Button from '../Button/Button';
import { useLivechat } from '../../contexts/LivechatContext';
import { useDialog } from '../../contexts/DialogContext';
import { VIEW_MODE } from '../../tools/constants';
import { useViewMode } from '../../contexts/ViewModeProvider';
import {
  DotsIcon,
  FontIncreaseIcon,
  FontDecreaseIcon,
  MaximizeIcon,
  CollapseIcon,
  MinimizeIcon,
  CloseIcon,
  ExitIcon,
  MoreOptionsIcon,
} from '../CustomIcons/CustomIcons';

/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing or expanding the chatbox
 */
export default function Header({ dialogRef, extended, gdprRef, minimal, onClose, onExpand, onMinimize, ...rest }) {
  const { configuration } = useConfiguration();
  const { addRgaaRef } = useUserAction();
  const { onDragStart } = useContext(DragonContext) || {};
  const { modal } = useContext(ModalContext);
  const { isOnboardingAlreadyDone } = useOnboarding();
  const onboardingEnable = configuration.onboarding.enable;
  const dragonZone = useRef();
  const dyduHeader = useRef();
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('translation');
  const { isMobile } = useViewport();
  const { actions: hasActions = {} } = configuration.header;
  const { items: consultationSpaces = [] } = configuration.spaces;
  const { image: hasImage, title: hasTitle } = configuration.header.logo;
  const defaultAvatar = configuration.avatar?.response?.image;
  const { livechatCustomAvatar, livechatImageLink } = configuration?.header?.livechatLogo || {};
  const { factor, maxFontSize, minFontSize } = configuration.header.fontSizeChange;
  const actionClose = t('header.actions.close');
  const actionExpand = t('header.actions.expand');
  const actionMinimize = t('header.actions.minimize');
  const actionMore = t('header.actions.more');
  const actionShrink = t('header.actions.shrink');
  const actionTests = t('header.actions.tests');
  const actionFontIncrease = t('header.actions.fontIncrease');
  const actionFontDecrease = t('header.actions.fontDecrease');
  const actionTest = t('header.actions.tests');
  const exitLivechat = t('header.actions.exitLivechat');
  const headerLogo = t('header.logo');
  const [fontSize, setFontSize] = useState(1);
  const gdprPassed = dydu.hasUserAcceptedGdpr();
  const singleTab = !configuration.tabs.hasContactTab;
  const { exportConversation, printConversation: _printConversation, sendGdprData } = configuration.moreOptions;
  const { interactions, typeResponse } = useDialog();
  const { enable: disclaimerEnable } = configuration.gdprDisclaimer;
  const theme = useTheme();
  const iconColorWhite = theme.palette.primary.text;
  const moreOptionsRef = useRef(null);
  const { send } = useLivechat();
  const { isOpen, mode } = useViewMode();
  const [prevMode, setPrevMode] = useState(null);
  const { isFull, isPopin } = useViewMode();
  const { tabbing } = useUserAction();
  const collapseRef = useRef(null);
  const maximizeRef = useRef(null);

  useEffect(() => {
    if (prevMode === VIEW_MODE.minimize && mode === VIEW_MODE.popin) {
      const rootElement = dyduHeader.current;
      const focusableElements = rootElement ? rootElement.querySelectorAll('button') : [];
      if (focusableElements.length > 0 && !isMobile) {
        focusableElements[0].focus();
      }
    }
    if (mode !== undefined) {
      setPrevMode(mode);
    }
  }, [isOpen]);

  useEffect(() => {
    addRgaaRef('moreOptionsRef', moreOptionsRef);
  }, [moreOptionsRef]);

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
        (!!exportConversation ||
          consultationSpaces.length > 1 ||
          (interactions.length > 1 && !!_printConversation) ||
          !!sendGdprData) &&
        (isOnboardingAlreadyDone || !onboardingEnable)
      );
    } else {
      return false;
    }
  }, [
    _printConversation,
    disclaimerEnable,
    exportConversation,
    gdprPassed,
    consultationSpaces,
    interactions.length,
    isOnboardingAlreadyDone,
    onboardingEnable,
    sendGdprData,
  ]);

  const testsMenu = [
    Object.keys(ACTIONS).map((it) => ({
      onClick: ACTIONS[it] && (() => window.dydu.chat.handleRewordClicked(it, { hide: true })),
      text: it,
    })),
  ];

  const actions = [
    {
      children: <Icon icon={<DotsIcon />} color={iconColorWhite} alt={actionTest} ariaLabel={actionTest} />,
      items: () => testsMenu,
      variant: 'icon',
      when: !!hasActions.tests && isOnboardingAlreadyDone && testsMenu.flat().length > 0,
      title: actionTests,
      id: 'dydu-dots',
    },
    {
      children: <Icon icon={<MoreOptionsIcon />} color={iconColorWhite} alt={actionMore} ariaLabel={actionMore} />,
      onClick: onToggleMore,
      variant: 'icon',
      when: checkDisplayParametersInMoreOptionsCog(),
      title: actionMore,
      id: 'dydu-more',
      ref: moreOptionsRef,
    },
    {
      children: (
        <Icon
          icon={<FontIncreaseIcon />}
          color={iconColorWhite}
          alt={actionFontIncrease}
          ariaLabel={actionFontIncrease}
        />
      ),
      disabled: fontSize >= maxFontSize,
      onClick: () => changeFontSize('increase'),
      variant: 'icon',
      when: !!hasActions.fontChange,
      title: actionFontIncrease,
      id: 'dydu-font-increase',
    },
    {
      children: (
        <Icon
          icon={<FontDecreaseIcon />}
          color={iconColorWhite}
          alt={actionFontDecrease}
          ariaLabel={actionFontDecrease}
        />
      ),
      disabled: fontSize <= minFontSize,
      onClick: () => changeFontSize('decrease'),
      variant: 'icon',
      when: !!hasActions.fontChange,
      title: actionFontDecrease,
      id: 'dydu-font-decrease',
    },
    {
      children: <Icon icon={<MaximizeIcon />} color={iconColorWhite} alt={actionExpand} ariaLabel={actionExpand} />,

      onClick: () => onExpand(true),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && !extended,
      title: actionExpand,
      id: 'dydu-expand',
      ref: maximizeRef,
    },
    {
      children: <Icon icon={<CollapseIcon />} color={iconColorWhite} alt={actionShrink} ariaLabel={actionShrink} />,
      onClick: () => onExpand(false),
      variant: 'icon',
      when: !!hasActions.expand && !isMobile && onExpand && extended,
      title: actionShrink,
      id: 'dydu-collapse',
      ref: collapseRef,
    },
    {
      children: <Icon icon={<MinimizeIcon />} color={iconColorWhite} alt={actionMinimize} ariaLabel={actionMinimize} />,
      onClick: onMinimize,
      variant: 'icon',
      when: !!hasActions.minimize,
      title: actionMinimize,
      id: 'dydu-minimize',
    },
    {
      children: <Icon icon={<CloseIcon />} color={iconColorWhite} alt={actionClose} ariaLabel={actionClose} />,
      onClick: onClose,
      variant: 'icon',
      when: !!hasActions.close,
      title: actionClose,
      id: 'dydu-close',
    },
  ];

  useEffect(() => {
    if (isFull && !isMobile && tabbing) {
      collapseRef?.current?.focus();
    } else if (isPopin && !isMobile && tabbing) {
      maximizeRef?.current?.focus();
    }
  }, [isFull, isPopin, collapseRef, tabbing, maximizeRef]);

  const shouldDisplayExitLivechatButton = Local.livechatType.load() && !Local.waitingQueue.load();

  const leaveLiveChat = () => {
    send && send('#livechatend#', { hide: true });
  };

  const renderHeaderLogo =
    Local.livechatType.load() && livechatCustomAvatar ? (
      <img src={`${process.env.PUBLIC_URL}assets/${livechatImageLink}`} alt={headerLogo} aria-hidden={true} />
    ) : (
      <AvatarsMatchingRequest typeResponse={typeResponse} headerAvatar={true} defaultAvatar={defaultAvatar} type={''} />
    );

  return (
    <div
      className={c('dydu-header', classes.root, { [classes.flat]: minimal })}
      {...rest}
      id="dydu-header"
      ref={dyduHeader}
    >
      <div
        className={c('dydu-header-body', classes.body, {
          [classes.draggable]: onDragStart,
        })}
        id="dydu-header-body"
        onMouseDown={onDragStart && onDragStart(dragonZone)}
        ref={dragonZone}
      >
        <div className={c('dydu-header-logo', classes.logo)} id="dydu-header-logo">
          {!!hasImage && (
            <div className={c('dydu-header-image', classes.image)} id="dydu-header-image" title={headerLogo}>
              {renderHeaderLogo}
            </div>
          )}
          {!!hasTitle && (
            <h1 className={c('dydu-header-title', classes.title)}>
              <Skeleton
                children={Local.livechatType.load() ? t('header.livechat.title') : t('header.title')}
                hide={!ready}
                variant="text"
                width="6em"
              />
            </h1>
          )}
        </div>
        <Actions
          actions={actions}
          className={c('dydu-header-actions', classes.actions)}
          id="dydu-header-actions-wrapper"
        />
      </div>
      {!minimal && (
        <>
          {!singleTab && <Tabs />}
          <Banner />
        </>
      )}
      {shouldDisplayExitLivechatButton && (
        <Button
          className={c('dydu-header-button', classes.endLivechat)}
          onClick={(e) => {
            e.stopPropagation();
            leaveLiveChat();
          }}
        >
          <div className={c('dydu-header-buttonContent', classes.buttonContent)}>
            {exitLivechat}
            <Icon
              icon={<ExitIcon />}
              alt={exitLivechat}
              className={c('dydu-header-endLivechatIcon', classes.endLivechatIcon)}
            />
          </div>
        </Button>
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
