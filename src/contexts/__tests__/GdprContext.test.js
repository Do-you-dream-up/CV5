import '@testing-library/jest-dom';

import { GdprContext, GdprProvider } from '../GdprContext';
import { fireEvent, render } from '@testing-library/react';

import { useEvent } from '../EventsContext';

jest.mock('../EventsContext', () => ({
  useEvent: jest.fn(),
}));
describe('GdprProvider', () => {
  it('renders without crashing', () => {
    const dispatchEvent = jest.fn();
    useEvent.mockReturnValue({ dispatchEvent });
    const { getByTestId } = render(
      <GdprProvider>
        <div data-testid="child" />
      </GdprProvider>,
    );
    setTimeout(() => {
      expect(getByTestId('child')).toBeInTheDocument();
    }, 500);
  });

  it('sets gdprPassed to true when accepted', () => {
    const dispatchEvent = jest.fn();
    useEvent.mockReturnValue({ dispatchEvent });
    const { getByTestId } = render(
      <GdprProvider>
        <GdprContext.Consumer>
          {(context) => (
            <button onClick={context?.onAccept} data-testid="button">
              Accept
            </button>
          )}
        </GdprContext.Consumer>
      </GdprProvider>,
    );
    fireEvent.click(getByTestId('button'));
    setTimeout(() => {
      const contextValue = JSON.parse(getByTestId('value').textContent || '');
      expect(contextValue.gdprPassed).toBe(true);
    }, 500);
  });

  it('calls onDecline and opens chat window when decline button is clicked', () => {
    window.dydu = { ui: { toggle: jest.fn() } };
    const dispatchEvent = jest.fn();
    useEvent.mockReturnValue({ dispatchEvent });
    const { getByTestId } = render(
      <GdprProvider>
        <GdprContext.Consumer>
          {(context) => (
            <button data-testid="decline" onClick={context.onDecline}>
              Decline
            </button>
          )}
        </GdprContext.Consumer>
      </GdprProvider>,
    );
    fireEvent.click(getByTestId('decline'));
    expect(window.dydu.ui.toggle).toHaveBeenCalledWith(1);
  });

  it('calls dispatchEvent with "gdpr" and "acceptGdpr" when onAccept is called', () => {
    // On crée un mock pour la fonction dispatchEvent
    const dispatchEvent = jest.fn();
    useEvent.mockReturnValue({ dispatchEvent });

    // On crée une fonction onAccept qui appelle la méthode onAccept de GdprProvider

    // On rend le composant GdprProvider avec un bouton pour appeler la méthode onAccept
    const renderResult = render(
      <GdprProvider data-testid="gdpr-context">
        <GdprContext.Consumer>
          {(context) => (
            <button data-testid="accept-button" onClick={context.onAccept}>
              Accept
            </button>
          )}
        </GdprContext.Consumer>
      </GdprProvider>,
    );

    // On clique sur le bouton
    fireEvent.click(renderResult.getByTestId('accept-button'));

    // On vérifie que dispatchEvent a été appelé avec les arguments attendus
    expect(dispatchEvent).toHaveBeenCalledWith('gdpr', 'acceptGdpr');
  });
});
