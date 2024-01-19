import '@testing-library/jest-dom';

import App from './App';
import { ProviderWrapper } from '../../tools/test-utils';
import { render } from '@testing-library/react';

jest.mock('../../tools/axios', () => ({
  emit: jest.fn().mockReturnValue(Promise.resolve()),
  SERVLET_API: {
    get: jest.fn(),
  },
  setCallOidcLogin: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Should render App component', async () => {
    const { container } = render(<App />, { wrapper: ProviderWrapper });
    expect(container.getElementsByClassName('dydu-application')).toBeDefined();
  });
});
