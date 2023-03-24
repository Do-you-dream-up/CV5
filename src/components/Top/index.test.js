import '@testing-library/jest-dom';

import { ConfigurationFixture } from '../../test/fixtures/configuration';
import Top from './index';
import { render } from '@testing-library/react';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useEvent } from '../../contexts/EventsContext';

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

jest.mock('../../contexts/EventsContext', () => ({
  useEvent: jest.fn(),
}));
describe('Top', () => {
  it('should render component when items exist', () => {
    useEvent.mockReturnValue({
      onEvent: jest.fn(),
    });
    render(<Top className="coucou" />);
  });

  xit('should call onEvent method', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.setEventsToTrue();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    useEvent.mockReturnValue({
      onEvent: jest.fn().mockReturnValue({}),
    });
    render(<Top className="coucou" />);

    expect(useEvent().onEvent).toHaveBeenCalledWith('topClicked');
  });
});
