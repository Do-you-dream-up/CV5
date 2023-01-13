import '@testing-library/jest-dom';
import { render } from '../../tools/test-utils';

import App from './App';
describe('App.tsx', () => {
  test('Should render App component', async () => {
    const { container } = render(<App />);
    expect(container.children[0]).toHaveClass('dydu-application');
  });
});
