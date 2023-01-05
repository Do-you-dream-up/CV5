import html from './sanitize';

describe('html', () => {
  it('returns the input HTML string', () => {
    const htmlString = '<p>Hello, world!</p>';
    expect(html(htmlString)).toEqual(htmlString);
  });

  it('returns an empty string if no input is provided', () => {
    expect(html()).toEqual('');
  });
});
