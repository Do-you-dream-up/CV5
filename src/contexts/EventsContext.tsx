import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import dotget from '../tools/dotget';
import { createEventNewMessages } from '../events/chatboxIndex';
import { useConfiguration } from './ConfigurationContext';
import useTabNotification from '../tools/hooks/useBlinkTitle';
import { useViewMode } from './ViewModeProvider';
import { useShadow } from './ShadowProvider';
import { Local } from '../tools/storage';

interface EventsContextProps {
  isMenuListOpen?: boolean;
  setIsMenuListOpen?: Dispatch<SetStateAction<boolean>>;
  onNewMessage?: (messageCount: number) => void;
  onEvent?: (feature: any) => (event: any, ...rest: any[]) => void;
  event?: (str: string) => void;
  dispatchEvent?: (featureName: string, eventName: string, ...rest: any[]) => void;
  saveChatboxRef?: (ref) => void;
  getChatboxRef?: () => null;
  messageCount?: number;
}

interface EventsProviderProps {
  children: ReactElement;
}

export const useEvent = () => useContext(EventsContext);

export const EventsContext = createContext<EventsContextProps>({});

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { isOpen } = useViewMode();
  const { setTabNotification, clearTabNotification, setLivechatNotification } = useTabNotification();
  const { configuration } = useConfiguration();

  const [event, setEvent] = useState<any | null>();
  const [isMenuListOpen, setIsMenuListOpen] = useState<boolean>(false);
  const { shadowAnchor } = useShadow();
  const [messageCount, setMessageCount] = useState<number>(0);
  const [chatboxRef, setChatboxRef] = useState<any>();
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const saveChatboxRef = (ref: any) => setChatboxRef(ref);

  const handleUserActive = () => {
    if (isOpenRef.current && Local.livechatType.load()) {
      clearTabNotification();
      setMessageCount(0);
    }
  };

  useEffect(() => {
    if (isOpenRef.current) {
      handleUserActive();
    }
  }, [isOpenRef.current]);

  useEffect(() => {
    shadowAnchor?.addEventListener('mouseenter', handleUserActive);
    shadowAnchor?.addEventListener('touchstart', handleUserActive);
    shadowAnchor?.addEventListener('focusin', handleUserActive);
    return () => {
      shadowAnchor?.removeEventListener('mouseenter', handleUserActive);
      shadowAnchor?.removeEventListener('touchstart', handleUserActive);
      shadowAnchor?.removeEventListener('focusin', handleUserActive);
    };
  }, [shadowAnchor]);

  const onNewMessage = useCallback(() => {
    if (Local.livechatType.load()) {
      setMessageCount((prevCount) => {
        const newCount = prevCount + 1;
        const eventNewMessage = createEventNewMessages(newCount);
        chatboxRef?.dispatchEvent(eventNewMessage);
        setLivechatNotification(eventNewMessage.detail.message);
        setTabNotification();
        return newCount;
      });
    }
  }, []);

  /**
   * Call `window` method by feature and event name.<br/>
   * If you have in your configuration.json :<br/>
   * ```json
   * events: {
   *   teaser: {
   *     onClick: ["teaserClick"]
   *     miscEvent: ["misc.event"]
   *   }
   * }
   * ```
   * **Feature**=teaser ; **Events**=onClick,miscEvent<br/>
   * The methods `window.teaserClick()` and `window.misc.event()` will be called<br/<br/>
   *
   * onEvent call example : `onEvent("teaser")("onClick");`
   *
   * @param feature : name of the feature in configuration.json
   */
  const onEvent =
    (feature: string) =>
    (event: string, ...rest: any[]) => {
      setEvent(`${feature}/${event}`);
      if (configuration?.events.active) {
        const actions = (configuration?.events?.features[feature] || {})[event];
        if (Array.isArray(actions)) {
          actions.forEach((action) => {
            if (configuration?.events.verbosity > 1) {
              console.info(`[Dydu][${feature}:${event}] '${action}' ${rest}`);
            }
            const f = dotget(window, action);
            if (typeof f === 'function') {
              f(...rest);
            } else if (configuration?.events.verbosity > 0) {
              console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
            }
          });
        }
      }
    };

  const dispatchEvent = (featureName, eventName, ...rest) => {
    const eventHandler = onEvent(featureName);

    eventHandler && eventHandler(eventName, ...rest);
  };

  return (
    <EventsContext.Provider
      children={children}
      value={{
        isMenuListOpen,
        setIsMenuListOpen,
        onNewMessage,
        onEvent,
        dispatchEvent,
        event,
        saveChatboxRef,
        messageCount,
        getChatboxRef: () => chatboxRef,
      }}
    />
  );
};
