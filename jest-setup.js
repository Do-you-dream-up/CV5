import jestMock from 'jest-fetch-mock';
jestMock.enableMocks();

process.env.PUBLIC_URL = 'https://cdn.doyoudreamup.com/chatbox/chatbox_edge_2022-12-13/';

global.crypto = {
  getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
  subtle: {
    digest: jest.fn(),
  },
};

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

global.ResizeObserver = require('resize-observer-polyfill');

global.fetch = jest.fn();
