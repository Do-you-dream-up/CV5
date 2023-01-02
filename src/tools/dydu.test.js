import dydu from './dydu';

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

global.window = Object.create(window);
const url = `http://${test.url}/to/file.html`;
Object.defineProperty(window, 'location', {
  value: {
    href: url,
  },
});

describe('helpers', () => {
  it('should use the "urlpart" strategy for space consultation detection', () => {
    // GIVEN
    const detectionStrategy = spaceConfiguration.detection;

    // WHEN
    const space = dydu.getSpace(detectionStrategy);

    // THEN
    expect(space).toEqual(test.space);
  });
});
