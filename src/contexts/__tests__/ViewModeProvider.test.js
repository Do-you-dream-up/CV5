import '@testing-library/jest-dom';

import ViewModeProvider, { useViewMode } from '../ViewModeProvider';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

describe('ViewModeProvider', () => {
  test('renders without crashing', () => {
    render(
      <ViewModeProvider>
        <div>Hello world</div>
      </ViewModeProvider>,
    );
    const helloWorld = screen.getByText(/Hello world/i);
    expect(helloWorld).toBeInTheDocument();
  });

  test('default view mode is minimize', () => {
    const TestComponent = () => {
      const { isMinimize } = useViewMode();
      return <div>{isMinimize ? 'Minimized' : 'Not minimized'}</div>;
    };

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>,
    );

    const minimizedText = screen.getByText(/minimized/i);
    expect(minimizedText).toBeInTheDocument();
  });

  test('toggle view mode to full', () => {
    const TestComponent = () => {
      const { isFull, openFull } = useViewMode();
      return (
        <div>
          <button onClick={openFull}>Open Full</button>
          <div>{isFull ? 'Full screen' : 'Not full screen'}</div>
        </div>
      );
    };

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>,
    );

    const openFullButton = screen.getByRole('button', { name: /open full/i });
    const notFullScreenText = screen.getByText(/not full screen/i);

    expect(notFullScreenText).toBeInTheDocument();

    userEvent.click(openFullButton);

    const fullScreenText = screen.getByText(/full screen/i);

    expect(fullScreenText).toBeInTheDocument();
  });
});
