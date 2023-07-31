import '@testing-library/jest-dom';

import App from './App';
import { render } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({ t: jest.fn(), ready: false }),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
