import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { LivechatProvider } from '../LivechatContext';

describe('LivechatProvider', () => {
  beforeEach(() => {
    // Clear any mocks and reset any state between tests
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should render children', () => {
    // Arrange
    const ChildComponent = () => <div>Child Component</div>;
    const props = { children: <ChildComponent /> };

    // Act
    render(<LivechatProvider {...props} />);
    const childComponent = screen.getByText(/Child Component/);

    // Assert
    expect(childComponent).toBeInTheDocument();
  });
});
