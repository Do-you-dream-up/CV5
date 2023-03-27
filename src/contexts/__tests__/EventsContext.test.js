import '@testing-library/jest-dom';

import { EventsProvider } from '../EventsContext';
import { render } from '../../tools/test-utils';
import { screen } from '@testing-library/react';

describe('EventsProvider', () => {
  it('renders its children', () => {
    render(
      <EventsProvider>
        <div data-testid="test-child">Test child</div>
      </EventsProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeDefined();
  });
});
