import sanitizeActions from '../actions';

describe('sanitizeActions', () => {
  it('should sanitize actions correctly', () => {
    const data = `
      javascript: testAction2("baz");
      javascript: testAction3();
    `;
    const expectedResponse = [
      { action: 'testAction2', parameters: ['baz'] },
      { action: 'testAction3', parameters: ['undefined'] },
    ];
    const result = sanitizeActions(data);
    expect(result).toEqual(expectedResponse);
  });

  it('should handle empty input correctly', () => {
    const data = '';
    const expectedResponse = [];
    const result = sanitizeActions(data);
    expect(result).toEqual(expectedResponse);
  });

  it('should handle input with no actions correctly', () => {
    const data = 'hello world';
    const expectedResponse = [];
    const result = sanitizeActions(data);
    expect(result).toEqual(expectedResponse);
  });
});
