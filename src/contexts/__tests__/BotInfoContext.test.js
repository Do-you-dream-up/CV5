import { act, render } from '@testing-library/react';

import { BotInfoProvider } from '../BotInfoContext';
import React from 'react';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../ConfigurationContext';

jest.mock('../ConfigurationContext');
jest.mock('../../tools/dydu');

const TestComponent = () => {
  const botLanguages = ['fr', 'en'];

  return <div>{botLanguages ? botLanguages?.join(', ') : 'Loading...'}</div>;
};

describe('BotInfoContext', () => {
  beforeEach(() => {
    useConfiguration.mockReturnValue({
      configuration: {
        application: {
          defaultLanguage: 'en',
        },
      },
    });

    dydu.getBotLanguages.mockResolvedValue([{ id: 'en' }, { id: 'fr' }, { id: 'es' }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('provides bot languages', async () => {
    const { container } = render(
      <BotInfoProvider>
        <TestComponent />
      </BotInfoProvider>,
    );

    expect(container.textContent).toBe('fr, en');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('handles errors gracefully', async () => {
    dydu.getBotLanguages.mockRejectedValueOnce(new Error('Error'));

    const { container } = render(
      <BotInfoProvider>
        <TestComponent />
      </BotInfoProvider>,
    );

    expect(container.textContent).toBe('fr, en');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
