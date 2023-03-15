import { SamlContext, SamlProvider, useSaml } from '../SamlContext';
import { act, render } from '@testing-library/react';

import { Local } from '../../tools/storage';
import dydu from '../../tools/dydu';
import { renderHook } from '@testing-library/react-hooks';

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
});
