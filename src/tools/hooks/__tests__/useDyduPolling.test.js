import { act, renderHook } from '@testing-library/react-hooks';
import useDyduPolling, { RESPONSE_TYPE, saveConfiguration, typeToChecker } from '../useDyduPolling';

import React from 'react';
import { render } from '@testing-library/react';

describe('useDyduPolling', () => {
  it('should save configuration properly', () => {
    const configuration = {
      showAnimationOperatorWriting: true,
      displayResponseText: true,
      displayNotification: true,
      endLivechat: jest.fn(),
      api: {},
      handleSurvey: jest.fn(),
    };
    const TestComponent = () => {
      const { open } = useDyduPolling();

      React.useEffect(() => {
        open(configuration);
      }, [open]);

      return null;
    };

    render(<TestComponent />);

    expect(configuration.endLivechat).not.toHaveBeenCalled();
    expect(configuration.handleSurvey).not.toHaveBeenCalled();
  });
  describe('typeToChecker', () => {
    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response is undefined',
      (type) => {
        // Arrange
        const response = undefined;

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );

    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response.text is undefined',
      (type) => {
        // Arrange
        const response = { fromDetail: 'John Doe' };

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );

    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response.fromDetail is undefined',
      (type) => {
        // Arrange
        const response = { text: 'Hello' };

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );
  });
});
