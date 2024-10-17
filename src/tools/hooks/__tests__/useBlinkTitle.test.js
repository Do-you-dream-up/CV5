import { act, renderHook } from '@testing-library/react-hooks';
import useTabNotification from '../useBlinkTitle';

jest.useFakeTimers();

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Local } from '../../storage';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          livechat: {
            notif: {
              newMessage: 'New Message',
            },
          },
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
  })
  .then((r) => {});

describe('useTabNotification', () => {
  afterEach(() => {
    document.title = '';
    jest.clearAllTimers();
  });

  test('should not keep the notification as a title when we stop to flash notification', () => {
    const { result } = renderHook(() => useTabNotification());
    document.title = 'Title of the document';
    const message = 'New message';

    act(() => {
      result.current.setTabNotification();
    });

    act(() => {
      result.current.clearTabNotification();
    });

    expect(document.title).not.toBe(message);
  });

  test('flash function should display alternatively title and notification', () => {
    const { result } = renderHook(() => useTabNotification());
    jest.spyOn(Local.livechatType, 'load').mockReturnValue(true);
    document.title = 'Page title';
    const message = 'New Message';

    const updatedTitle = result.current.displayAlternativelyPageTitleAndNotification();
    expect(updatedTitle).toBe(message);

    const updatedAgainTitle = result.current.displayAlternativelyPageTitleAndNotification();
    expect(updatedAgainTitle).not.toBe(message);
  });

  test('the title of the page could be changed', () => {
    const { result } = renderHook(() => useTabNotification());

    document.title = 'Page title 1';
    const title1 = result.current.changeOrKeepTitlePage();
    expect(title1).toBe('Page title 1');

    document.title = 'Page title 2';
    const title2 = result.current.changeOrKeepTitlePage();
    expect(title2).toBe('Page title 2');

    document.title = 'Page title 3';
    const title3 = result.current.changeOrKeepTitlePage();
    expect(title3).toBe('Page title 3');
  });
});
