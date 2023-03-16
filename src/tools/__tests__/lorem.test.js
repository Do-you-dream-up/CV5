import { LOREM } from '../lorem';

describe('LOREM', () => {
  it('has the expected properties and values', () => {
    expect(LOREM).toHaveProperty('links');
    expect(LOREM).toHaveProperty('lists');
    expect(LOREM).toHaveProperty('paragraphs');

    expect(LOREM.links).toMatchSnapshot();
    expect(LOREM.lists).toMatchSnapshot();
    expect(LOREM.paragraphs).toMatchSnapshot();
  });
});
