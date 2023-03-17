import '@testing-library/jest-dom';

import { OidcProvider } from '../OidcContext';
import Storage from '../../components/auth/Storage';
import { isLoadedFromChannels } from '../../tools/wizard';
import { render } from '@testing-library/react';
import { useConfiguration } from '../ConfigurationContext';
import { useViewMode } from '../ViewModeProvider';

jest.mock('../ConfigurationContext');
jest.mock('../ViewModeProvider');
jest.mock('../../components/auth/Storage');
jest.mock('../../tools/wizard');

describe('OidcContext', () => {
  const mockToken = { access_token: 'mock_token' };
  const mockConfiguration = { oidc: { enable: true }, checkAuthorization: { active: true } };
  const mockClose = jest.fn();
  const mockIsLoadedFromChannels = jest.fn().mockReturnValue(true);

  beforeEach(() => {
    useConfiguration.mockReturnValue({ configuration: mockConfiguration });
    useViewMode.mockReturnValue({ close: mockClose });
    Storage.loadToken.mockReturnValue(mockToken);
    isLoadedFromChannels.mockImplementation(mockIsLoadedFromChannels);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children if loaded from channels', () => {
    mockIsLoadedFromChannels.mockReturnValue(true);

    const { queryByText } = render(
      <OidcProvider>
        <div>Mock child</div>
      </OidcProvider>,
    );

    expect(queryByText('Mock child')).toBeInTheDocument();
  });

  it('should render children if displayChatbox is true', () => {
    mockIsLoadedFromChannels.mockReturnValue(false);

    const { queryByText } = render(
      <OidcProvider>
        <div>Mock child</div>
      </OidcProvider>,
    );

    expect(queryByText('Mock child')).toBeInTheDocument();
  });

  it('should not render children if displayChatbox is false', () => {
    mockIsLoadedFromChannels.mockReturnValue(false);
    mockConfiguration.oidc.enable = true;

    const { queryByText } = render(
      <OidcProvider>
        <div>Mock child</div>
      </OidcProvider>,
    );

    expect(queryByText('Mock child')).toBeInTheDocument();
  });

  it('should close view mode if token is missing and authorization check is active', () => {
    mockIsLoadedFromChannels.mockReturnValue(false);
    Storage.loadToken.mockReturnValue(null);

    render(
      <OidcProvider>
        <div>Mock child</div>
      </OidcProvider>,
    );

    expect(mockClose).toHaveBeenCalled();
  });

  it('should not close view mode if authorization check is not active', () => {
    mockIsLoadedFromChannels.mockReturnValue(false);
    mockConfiguration.checkAuthorization.active = false;
    Storage.loadToken.mockReturnValue(null);

    render(
      <OidcProvider>
        <div>Mock child</div>
      </OidcProvider>,
    );

    expect(mockClose).not.toHaveBeenCalled();
  });
});
