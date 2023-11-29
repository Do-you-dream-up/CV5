import '@testing-library/jest-dom';

import App from './App';
import { ProviderWrapper } from '../../tools/test-utils';
import { render } from '@testing-library/react';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Should render App component', async () => {
    const { container } = render(<App />, { wrapper: ProviderWrapper });
    expect(container.getElementsByClassName('dydu-application')).toBeDefined();
  });
});
