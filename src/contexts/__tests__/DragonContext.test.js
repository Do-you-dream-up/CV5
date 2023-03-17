import '@testing-library/jest-dom';

import { DragonContext, DragonProvider } from '../DragonContext';

import { render } from '@testing-library/react';

describe('DragonProvider', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <DragonProvider>
        <div data-testid="child" />
      </DragonProvider>,
    );
    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('passes onDrag and onDragStart to the context value', () => {
    const onDrag = jest.fn();
    const onDragStart = jest.fn();
    const { getByTestId } = render(
      <DragonProvider onDrag={onDrag} onDragStart={onDragStart}>
        <DragonContext.Consumer>
          {(context) => <div data-testid="value">{JSON.stringify(context)}</div>}
        </DragonContext.Consumer>
      </DragonProvider>,
    );
    const contextValue = JSON.parse(getByTestId('value').textContent || '');
    setTimeout(() => {
      expect(contextValue.onDrag).toBe(onDrag);
      expect(contextValue.onDragStart).toBe(onDragStart);
    }, 500);
  });
});
