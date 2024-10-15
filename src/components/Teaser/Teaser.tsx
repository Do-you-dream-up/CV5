import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Skeleton from '../Skeleton';
import Voice from '../Voice';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useViewMode } from '../../contexts/ViewModeProvider';
import { useUserAction } from '../../contexts/UserActionContext';
import { VIEW_MODE } from '../../tools/constants';

interface TeaserProps {
  id?: string;
  toggle?: (mode: number) => void;
  openDisclaimer?: boolean;
  disclaimer?: any;
}

const TEASER_TYPES = {
  AVATAR_AND_TEXT: 0,
  AVATAR_ONLY: 1,
  TEXT_ONLY: 2,
};

/**
 * Minified version of the chatbox.
 */
const Teaser = ({ id, toggle, openDisclaimer, disclaimer }: TeaserProps) => {
  const { configuration } = useConfiguration();

  const isDragActive: boolean | undefined = configuration?.dragon?.active;

  const { isMinimize } = useViewMode();

  const event = useEvent()?.onEvent?.('teaser');
  const classes = useStyles({ configuration });
  const { ready, t } = useTranslation('translation');
  const { tabbing } = useUserAction();
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef(position);

  // DISPLAY TEASER TYPE
  const { AVATAR_AND_TEXT, AVATAR_ONLY, TEXT_ONLY } = TEASER_TYPES;
  const initialTeaserType: number | undefined =
    !configuration?.teaser?.displayType ||
    configuration?.teaser?.displayType > TEXT_ONLY ||
    configuration?.teaser?.displayType < AVATAR_AND_TEXT
      ? AVATAR_AND_TEXT
      : configuration?.teaser?.displayType;

  const openChatboxOnClickOrTouch = () => {
    event && event('onClick');
    toggle && toggle(VIEW_MODE.popin);
  };

  useEffect(() => {
    if (isMinimize && tabbing) {
      teaserRef?.current?.focus();
    }
  }, [isMinimize, tabbing, teaserRef]);

  const handleLongPress = () => {
    setIsCommandHandled(true);
  };

  const handleButtonPress = (e) => {
    if (e.button === 2) return;
    if (buttonPressTimer) clearTimeout(buttonPressTimer);

    setButtonPressTimer(setTimeout(handleLongPress, 250, e));

    setIsCommandHandled(false);
  };

  const handleButtonRelease = (e) => {
    if (e.button === 2) return;
    if (!isCommandHandled) {
      openChatboxOnClickOrTouch();
      //isCommandHandled isn't updated here, as a result logic is executed always
      // got regular click, not long press
      setIsCommandHandled(true);
    }

    clearTimeout(buttonPressTimer);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      event.preventDefault();
      openChatboxOnClickOrTouch();
    }
  };

  const tabIndex: number = parseInt('1', 10);

  const renderVoiceInput = () => {
    return dydu.hasUserAcceptedGdpr() && isMinimize && voice && disclaimerEnable ? (
      <Voice configuration={configuration} show={dydu.hasUserAcceptedGdpr()} t={t('input.actions.record')} />
    ) : null;
  };

  // Origin (x:0, y:0) is positioned at the bottom-right corner
  const handleResize = () => {
    const rect = teaserRef.current.getBoundingClientRect();
    let newX = positionRef.current.x;
    let newY = positionRef.current.y;
    if (rect.left < 0) {
      newX = positionRef.current.x - rect.left;
    }
    if (rect.top < 0) {
      newY = positionRef.current.y - rect.top;
    }
    if (newY != positionRef.current.y || newX != positionRef.current.x) {
      setPosition({ x: newX, y: newY });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDrag = (_e: any, data: { x: any; y: any }) => {
    positionRef.current = position;
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable disabled={!isDragActive} bounds="html" position={position} onDrag={handleDrag}>
      <div
        data-testid={id}
        className={c('dydu-teaser', classes.root, { [classes.hidden]: !isMinimize })}
        id={id}
        aria-labelledby={id + '-chatbot'}
      >
        <div className={c('dydu-teaser-container', classes.dyduTeaserContainer)} id={id + '-chatbot'}>
          {openDisclaimer && disclaimer ? disclaimer() : null}
          <div className={c('dydu-teaser-container-content', classes.dyduTeaserContainerContent)}>
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
      </div>
    </Draggable>
  );
};

export default Teaser;
