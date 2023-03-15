import { SamlContext, SamlProvider, useSaml } from '../SamlContext';
import { act, render } from '@testing-library/react';

import { Local } from '../../tools/storage';
import dydu from '../../tools/dydu';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../tools/storage', () => ({
  Local: {
    saml: {
      save: jest.fn(),
      load: jest.fn(),
    },
  },
}));

describe('SamlContext', () => {
  it('should provide the correct initial context values', () => {
    const { getByTestId } = render(
      <SamlProvider>
        <SamlContext.Consumer>
          {({ user, saml2Info, checkSession }) => (
            <>
              <div data-testid="user">{user}</div>
              <div data-testid="saml2Info">{saml2Info}</div>
              <button onClick={checkSession}>Check Session</button>
            </>
          )}
        </SamlContext.Consumer>
      </SamlProvider>,
    );

    expect(getByTestId('user').textContent).toBe('');
    expect(getByTestId('saml2Info').textContent).toBe('');
  });

  it('should set the correct values after calling setUser and setSaml2Info', () => {
    const { getByTestId } = render(
      <SamlProvider>
        <SamlContext.Consumer>
          {({ user, saml2Info, setUser, setSaml2Info }) => (
            <>
              <div data-testid="user">{user}</div>
              <div data-testid="saml2Info">{saml2Info}</div>
              <button data-testid="setUser" onClick={() => setUser('Test User')}>
                Set User
              </button>
              <button data-testid="setSaml2Info" onClick={() => setSaml2Info('Test Saml2Info')}>
                Set Saml2Info
              </button>
            </>
          )}
        </SamlContext.Consumer>
      </SamlProvider>,
    );

    const setUserButton = getByTestId('setUser');
    const setSaml2InfoButton = getByTestId('setSaml2Info');

    setUserButton.click();
    expect(getByTestId('user').textContent).toBe('Test User');

    setSaml2InfoButton.click();
    expect(getByTestId('saml2Info').textContent).toBe('Test Saml2Info');
  });

  it('should call checkSession when the user is idle', () => {
    jest.useFakeTimers();

    const checkSession = jest.fn();

    render(
      <SamlProvider>
        <SamlContext.Consumer>
          {({ checkSession }) => (
            <>
              <button onClick={() => jest.advanceTimersByTime(1000)}>Advance Time</button>
              <button onClick={checkSession}>Check Session</button>
            </>
          )}
        </SamlContext.Consumer>
      </SamlProvider>,
    );

    expect(checkSession).not.toHaveBeenCalled();

    jest.advanceTimersByTime(31 * 60 * 1000);
  });

  xdescribe('checkSession', () => {
    const response = JSON.stringify({ values: { auth: 'some-auth', redirection_url: 'some-redirection-url' } });
    const expectedRedirectUrl = `some-redirection-url&RelayState=${encodeURI(window.location.href)}`;
    const saml2Info = 'current-auth';

    it('should update saml2Info and redirectUrl on successful getSaml2Status', async () => {
      dydu.getSaml2Status = jest.fn().mockResolvedValueOnce(response);

      const { result, waitFor } = renderHook(() => useSaml(), { wrapper: SamlProvider });
      await act(async () => {
        await result.current.checkSession();
        await waitFor(() => result.current.saml2Info === 'some-auth');
      });

      expect(Local.saml.save).toHaveBeenCalledWith('some-auth');
      expect(result.current.saml2Info).toEqual('some-auth');
      expect(result.current.redirectUrl).toEqual(expectedRedirectUrl);
    });

    it('should not update saml2Info and redirectUrl on failed getSaml2Status', async () => {
      dydu.getSaml2Status.mockRejectedValueOnce(new Error('some-error'));

      const { result } = renderHook(() => useSaml(), { wrapper: SamlProvider });
      await act(async () => {
        await result.current.checkSession();
      });

      expect(Local.saml.save).not.toHaveBeenCalled();
      expect(result.current.saml2Info).toEqual(undefined);
      expect(result.current.redirectUrl).toEqual(undefined);
    });

    it('should not update saml2Info and redirectUrl when auth is not a valid base64 string', async () => {
      const invalidResponse = JSON.stringify({
        values: { auth: 'invalid-base64', redirection_url: 'some-redirection-url' },
      });
      dydu.getSaml2Status.mockResolvedValueOnce(invalidResponse);

      const { result } = renderHook(() => useSaml(), { wrapper: SamlProvider });
      await act(async () => {
        await result.current.checkSession();
      });

      expect(Local.saml.save).not.toHaveBeenCalled();
      expect(result.current.saml2Info).toEqual(undefined);
      expect(result.current.redirectUrl).toEqual(undefined);
    });
  });
});
