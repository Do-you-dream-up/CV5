import { CHATBOX_EVENT_NAME } from '../tools/constants';

export const eventOnSidebarClosed = new CustomEvent(CHATBOX_EVENT_NAME.closeSidebar, {
  detail: {
    message: CHATBOX_EVENT_NAME.closeSidebar,
    time: new Date(),
  },
  bubbles: true,
  cancelable: true,
});

export const eventNewMessage = new CustomEvent(CHATBOX_EVENT_NAME.newMessage, {
  detail: {
    message: '1 nouveau message',
    time: new Date(),
  },
  bubbles: true,
  cancelable: true,
});

export const createEventNewMessages = (messageCount: number) => {
  if (messageCount === 1) {
    return eventNewMessage;
  }
  return new CustomEvent(CHATBOX_EVENT_NAME.newMessage, {
    detail: {
      message: `${messageCount} nouveaux messages`,
      time: new Date(),
    },
    bubbles: true,
    cancelable: true,
  });
};
