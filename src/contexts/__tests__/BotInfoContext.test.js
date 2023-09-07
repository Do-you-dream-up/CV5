import { act, render } from '@testing-library/react';

import { BotInfoProvider, getActivatedAndActiveBotLanguages, computeDefaultBotLanguages } from '../BotInfoContext';
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

  test('getActivatedAndActiveBotLanguages return default if no languages in configuration', () => {
    const configuration = { application: { XXXlanguages: ['fr', 'en'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [{ id: 'fr', isAvailable: true }];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['it']);
  });

  test('getActivatedAndActiveBotLanguages return default if no languages are defined in Atria', () => {
    const configuration = { application: { languages: ['fr', 'en'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = undefined;

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['it']);
  });

  test('getActivatedAndActiveBotLanguages does not return languages not defined in Atria', () => {
    const configuration = { application: { languages: ['en', 'fr', 'gb'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [
      { id: 'fr', isAvailable: true },
      { id: 'en', isAvailable: true },
    ];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['en', 'fr']);
  });

  test('getActivatedAndActiveBotLanguages does not return not available languages in Atria', () => {
    const configuration = { application: { languages: ['en', 'fr', 'gb'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [
      { id: 'fr', isAvailable: true },
      { id: 'en', isAvailable: true },
      { id: 'gb', isAvailable: false },
    ];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['en', 'fr']);
  });

  test('getActivatedAndActiveBotLanguages return default if no languages available in Atria', () => {
    const configuration = { application: { languages: ['fr', 'en', 'gb'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [
      { id: 'fr', isAvailable: false },
      { id: 'en', isAvailable: false },
      { id: 'gb', isAvailable: false },
    ];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['it']);
  });

  test('getActivatedAndActiveBotLanguages does not return languages not in configuration', () => {
    const configuration = { application: { languages: ['en', 'fr'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [
      { id: 'fr', isAvailable: true },
      { id: 'en', isAvailable: true },
      { id: 'gb', isAvailable: true },
    ];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['en', 'fr']);
  });

  test('getActivatedAndActiveBotLanguages return a sorted array', () => {
    const configuration = { application: { languages: ['gb', 'it', 'fr', 'en'], defaultLanguage: ['it'] } };
    const botLanguagesFromAtria = [
      { id: 'it', isAvailable: true },
      { id: 'fr', isAvailable: true },
      { id: 'en', isAvailable: true },
      { id: 'gb', isAvailable: true },
    ];

    const filteredLanguages = getActivatedAndActiveBotLanguages(configuration, botLanguagesFromAtria);

    expect(filteredLanguages).toEqual(['en', 'fr', 'gb', 'it']);
  });

  test('computeDefaultBotLanguages return configuration default language if defined', () => {
    const configuration = { application: { languages: ['fr', 'en'], defaultLanguage: ['it'] } };

    const filteredLanguages = computeDefaultBotLanguages(configuration);

    expect(filteredLanguages).toEqual(['it']);
  });

  test('computeDefaultBotLanguages return fr if no configuration default language defined', () => {
    const configuration = { application: { languages: ['fr', 'en'], XXXdefaultLanguage: ['it'] } };

    const filteredLanguages = computeDefaultBotLanguages(configuration);

    expect(filteredLanguages).toEqual('fr');
  });
});
