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
