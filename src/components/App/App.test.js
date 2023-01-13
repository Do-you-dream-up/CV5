import '@testing-library/jest-dom';
import { render } from '../../tools/test-utils';

import App from './App';
describe('App.tsx', () => {
  test('Should render App component', async () => {
    const { container } = render(<App />);
    expect(container.children[0]).toHaveClass('dydu-application');
  });

  test('Should render App component with custom font url', async () => {
    const { container } = render(<App />, { configuration: { font: { url: 'font/url/' } } });
    expect(container.children[0]).toHaveClass('dydu-application');
  });

  test('Should render App component with with /dydupanel in query param', async () => {
    delete window.location;
    window.location = {
      search: '?dydupanel',
    };
    const { container } = render(<App />);
    expect(container.children[0]).toHaveClass('dydu-application');
  });
});
