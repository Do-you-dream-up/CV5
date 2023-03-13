import dydu from '../dydu';
import { fakeLocalStorage } from '../../test/fixtures/globalFixtures';

const test = {
  url: 'doyoudreamup.com/test/',
  space: 'dydu-test-space',
};

const spaceConfiguration = {
  active: true,
  detection: [
    {
      active: true,
      mode: 'urlpart',
      value: {
        [test.url]: test.space,
      },
    },
    {
      active: false,
      mode: 'cookie',
      value: 'dyduspace',
    },
    {
      active: false,
      mode: 'localstorage',
      value: 'dyduspace',
    },
    {
      active: false,
      mode: 'urlparameter',
      value: 'dyduspace',
    },
    {
      active: false,
      mode: 'global',
      value: 'dyduspace',
    },
    {
      active: false,
      mode: 'route',
      value: {
        '/': 'dydu',
      },
    },
    {
      active: false,
      mode: 'hostname',
      value: {
        'doyoudreamup.com': 'dydu',
      },
    },
  ],
  items: ['default'],
};

const url = `http://${test.url}/to/file.html`;
Object.defineProperty(window, 'location', {
  value: {
    href: url,
  },
});

describe('dydu.js', () => {
  describe('getSpace', () => {
    it('should use the "urlpart" strategy for space consultation detection', () => {
      // GIVEN
      const detectionStrategy = spaceConfiguration.detection;

      // WHEN
      const space = dydu.getSpace(detectionStrategy);

      // THEN
      expect(space).toEqual(test.space);
    });
  });

  describe('getContextId', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
    });

    it('should get the botId by request', () => {
      const contextId = dydu.getContextId();
      console.log('🚀 ~ file: dydu.test.js:87 ~ it ~ contextId:', contextId);
      // no lc
      // with request
    });

    it('should get the botId by localStorage request', () => {
      const k = 'somekey';
      localStorage.setItem(k, JSON.stringify({ value: 'ok' }));
      expect(JSON.parse(localStorage.getItem(k)).value).toEqual('ok');
      // no request
      // with lc
    });

    it('should combine botId and directoryId in a whole string to create contextIdKey', () => {
      // bot; dir
      // expect(Local.combineBotDir(bot,dir) === 'botid/dir')
    });

    it('should retrieve the correct contextId using botId and directoryId', () => {
      // combine11 = boti1/dir1; context1=1
      // combine12 = boti1/dir2; context2=2
      // expect(get(combine1) !== combine2)
    });

    it('should', () => {});
  });
});
