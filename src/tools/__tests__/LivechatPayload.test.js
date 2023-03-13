describe('PAYLOAD_COMMON_CONTENT', () => {
  test('PAYLOAD_COMMON_CONTENT has expected structure and values', () => {
    let PAYLOAD_COMMON_CONTENT = {
      contextId: null,
      botId: null,
      space: null,
      clientId: null,
      language: null,
      userUrl: window.location.href,
      browser: 'Mozilla Firefox',
      os: 'Windows',
    };
    expect(PAYLOAD_COMMON_CONTENT).toEqual({
      contextId: null,
      botId: null,
      space: null,
      clientId: null,
      language: null,
      userUrl: window.location.href,
      browser: expect.any(String),
      os: expect.any(String),
    });
  });
});
