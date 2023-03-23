import '@testing-library/jest-dom';

import { fireEvent, screen } from '@testing-library/react';

import Dragon from './';
import { render } from '../../tools/test-utils';

describe('Dragon', () => {
  it('renders the component passed as prop with the DragonProvider context', () => {
    const MockComponent = jest.fn(() => <div>Mock Component</div>);
    render(<Dragon component={MockComponent} />);

    expect(MockComponent).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Mock Component')).toBeDefined();
  });

  test('onDragEnd updates state variables', () => {
    const { container } = render(<Dragon component="div" />);
    const root = container.firstChild;
    const initialX = 0;
    const initialY = 0;

    // Simulate a mousedown event to set the origin
    fireEvent.mouseDown(root, { clientX: initialX, clientY: initialY });

    // Simulate a mousemove event to update the offset
    fireEvent.mouseMove(root, { clientX: initialX + 10, clientY: initialY + 20 });

    // Simulate a mouseup event to trigger onDragEnd
    fireEvent.mouseUp(root);

    // Check if the state variables are updated correctly
    expect(root.style.transitionDuration).toBe('');
    expect(root).toHaveStyle(`transform: translate3d(0px, 0px, 0)`);
  });
});
