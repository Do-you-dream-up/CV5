import '@testing-library/jest-dom';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ConfigurationFixture } from '../../test/fixtures/configuration';
import Top from './index';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useTopKnowledge } from '../../contexts/TopKnowledgeContext';
import { useEvent } from '../../contexts/EventsContext';

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

jest.mock('../../contexts/TopKnowledgeContext', () => ({
  useTopKnowledge: jest.fn(),
}));

jest.mock('../../contexts/EventsContext', () => ({
  useEvent: jest.fn(),
}));
describe('Top', () => {
  it('should not render component when items does not exist', () => {
    useTopKnowledge.mockReturnValue({ items: {} });
    useEvent.mockReturnValue({
      onEvent: jest.fn(),
    });
    const { container } = render(<Top />);
    expect(container.firstChild).toBeNull();
  });

  it('should call onEvent method', async () => {
    useTopKnowledge.mockReturnValue({ topKnowledge: [{ reword: 'test' }] });
    const newConfig = new ConfigurationFixture();
    newConfig.setEventsToTrue();
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    const eventMonck = jest.fn();
    useEvent.mockReturnValue({
      onEvent: jest.fn().mockReturnValue(eventMonck),
    });
    screen.debug();
    act(() => {
      const { getByTestId } = render(<Top />);
      fireEvent.click(getByTestId('dyduTopItems'));
    });

    await waitFor(() => expect(eventMonck).toHaveBeenCalledTimes(2));

    expect(eventMonck).toHaveBeenCalledWith('topClicked', 'test');
    expect(eventMonck).toHaveBeenCalledWith('topDisplay');
  });
});
