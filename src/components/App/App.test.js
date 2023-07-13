import '@testing-library/jest-dom';

import App from './App';
import { render } from '../../tools/test-utils';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const tSpy = jest.fn((str) => str);
    const useTranslationSpy = useTranslation;

    useTranslationSpy.mockReturnValue({
      t: tSpy,
      i18n: {
        language: 'en',
      },
    });
  });

  test('Should render App component', async () => {
    const { container } = render(<App />);
    expect(container.getElementsByClassName('dydu-application')).toBeDefined();
  });

  // test('Should render App component with custom font url', async () => {
  //   const { container } = render(<App />, { configuration: { font: { url: 'font/url/' } } });
  //   expect(container.children[0]).toHaveClass('dydu-application');
  // });

  // test('Should render App component with with /dydupanel in query param', async () => {
  //   delete window.location;
  //   window.location = {
  //     search: '?dydupanel',
  //   };
  //   const { container } = render(<App />);
  //   expect(container.children[0]).toHaveClass('dydu-application');
  // });
});
