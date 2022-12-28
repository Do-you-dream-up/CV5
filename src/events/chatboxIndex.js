import { CHATBOX_EVENT_NAME } from '../tools/constants';

export const eventOnSecondaryClosed = new CustomEvent(CHATBOX_EVENT_NAME.closeSecondary, {
  detail: {
    message: CHATBOX_EVENT_NAME.closeSecondary,
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
