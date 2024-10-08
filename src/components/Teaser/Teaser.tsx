import { MutableRefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import Draggable from 'react-draggable';
import Skeleton from '../Skeleton';
import { UserActionContext } from '../../contexts/UserActionContext';
import Voice from '../Voice';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useViewMode } from '../../contexts/ViewModeProvider';

interface TeaserProps {
  open?: boolean;
  toggle?: any;
}

const TEASER_TYPES = {
  AVATAR_AND_TEXT: 0,
  AVATAR_ONLY: 1,
  TEXT_ONLY: 2,
};

/**
 * Minified version of the chatbox.
 */
const Teaser = ({ open, toggle }: TeaserProps) => {
  const { configuration } = useConfiguration();

  const isDragActive: boolean | undefined = configuration?.dragon?.active;

  const isDraggable: boolean | undefined = useMemo(() => isDragActive, [isDragActive]);

  const { isMinimize } = useViewMode();

  const event = useEvent()?.onEvent?.('teaser');
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('translation');
  const { tabbing } = useContext(UserActionContext) || false;
  const { enable: disclaimerEnable } = configuration?.gdprDisclaimer || {};
  const teaserRef = useRef() as MutableRefObject<HTMLDivElement>;

  const title: string = t('teaser.title');
  const titleHidden: string = t('teaser.titleHidden');
  const mouseover: string = t('teaser.mouseover');

  const teaserAvatar: string | undefined =
    configuration?.avatar?.teaser?.image || configuration?.avatar?.response?.image;
  const teaserAvatarBackground: boolean | undefined = configuration?.avatar?.teaser?.background;

  const logoTeaser: string | undefined = teaserAvatar?.includes('base64')
    ? teaserAvatar
    : `${process.env.PUBLIC_URL}assets/${teaserAvatar}`;

  const voice: boolean | undefined = configuration?.Voice ? configuration?.Voice.enable : false;
  const [isCommandHandled, setIsCommandHandled] = useState<boolean>(false);
  const [buttonPressTimer, setButtonPressTimer] = useState<number>();

  // DISPLAY TEASER TYPE
  const { AVATAR_AND_TEXT, AVATAR_ONLY, TEXT_ONLY } = TEASER_TYPES;
  const initialTeaserType: number | undefined =
    !configuration?.teaser?.displayType ||
    configuration?.teaser?.displayType > TEXT_ONLY ||
    configuration?.teaser?.displayType < AVATAR_AND_TEXT
      ? AVATAR_AND_TEXT
      : configuration?.teaser?.displayType;

  const openChatboxOnClickOrTouch = useCallback(() => {
    event && event('onClick');
    toggle(2)();
  }, [event, toggle]);

  useEffect(() => {
    if (isMinimize && tabbing) {
      teaserRef?.current?.focus();
    }
  }, [isMinimize, tabbing, teaserRef]);

  const handleLongPress = useCallback(() => {
    setIsCommandHandled(true);
  }, []);

  const handleButtonPress = useCallback(
    (e) => {
      if (e.button !== 0) return;
      if (buttonPressTimer) clearTimeout(buttonPressTimer);

      setButtonPressTimer(setTimeout(handleLongPress, 250, e));

      setIsCommandHandled(false);
    },
    [buttonPressTimer, handleLongPress],
  );

  const handleButtonRelease = useCallback(
    (e) => {
      if (e.button !== 0) return;
      if (!isCommandHandled) {
        openChatboxOnClickOrTouch();
        //isCommandHandled isn't updated here, as a result logic is executed always
        // got regular click, not long press
        setIsCommandHandled(true);
      }

      clearTimeout(buttonPressTimer);
    },
    [buttonPressTimer, isCommandHandled, openChatboxOnClickOrTouch],
  );

  const onKeyDown = (event) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      openChatboxOnClickOrTouch();
    }
  };

  const tabIndex: number = parseInt('0', 10);

  const showVoiceInput: boolean | undefined = useMemo(() => {
    return dydu.hasUserAcceptedGdpr() && open && voice && disclaimerEnable;
  }, [open, disclaimerEnable, voice]);

  const renderVoiceInput = useCallback(() => {
    return showVoiceInput ? (
      <Voice configuration={configuration} show={dydu.hasUserAcceptedGdpr()} t={t('input.actions.record')} />
    ) : null;
  }, [configuration]);

  return (
    <Draggable disabled={!isDraggable} bounds="html">
      <div
        data-testid="teaser-chatbot"
        className={c('dydu-teaser', classes.root, { [classes.hidden]: !open })}
        id="dydu-teaser"
        aria-labelledby="teaser-chatbot"
      >
        <div className={c('dydu-teaser-container', classes.dyduTeaserContainer)} id="teaser-chatbot">
          <div
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
            onKeyDown={onKeyDown}
            onTouchStart={handleButtonPress}
            onTouchEnd={handleButtonRelease}
            title={mouseover}
            role="button"
            tabIndex={tabIndex}
            ref={teaserRef}
            className={c('dydu-teaser-title', classes.dyduTeaserTitle, {
              [classes.hideOutline]: !tabbing,
            })}
          >
            {(initialTeaserType === AVATAR_AND_TEXT || initialTeaserType === TEXT_ONLY) && (
              <p className={c('dydu-teaser-button', classes.button)}>
                <Skeleton children={title} hide={!ready} width="3em" />
              </p>
            )}
            {(initialTeaserType === AVATAR_AND_TEXT || initialTeaserType === AVATAR_ONLY) && (
              <div
                className={c('dydu-teaser-brand', classes.brand, teaserAvatarBackground && classes.backgroundAvatar)}
              >
                <h1>{titleHidden}</h1>
                <img onKeyDown={onKeyDown} alt="" src={logoTeaser} />
              </div>
            )}
          </div>
          {renderVoiceInput()}
        </div>
      </div>
    </Draggable>
  );
};

export default Teaser;
