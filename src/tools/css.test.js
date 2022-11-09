import { prefixCssSelectors } from './css';

describe('css js', () => {
  it('should find prefix tag in result', () => {
    // GIVEN
    const PREFIX_TAG = 'tag_prefix';
    const CLASSNAME = '.myclass';
    const strStyles = `${CLASSNAME} { color: 'red'}`;

    // WHEN
    const prefixedStyles = prefixCssSelectors(strStyles, PREFIX_TAG);

    // THEN
    expect(prefixedStyles).toContain(PREFIX_TAG);
  });

  it('should find prefix tag before className position', () => {
    // GIVEN
    const PREFIX_TAG = 'tag_prefix';
    const CLASSNAME = '.myclass';
    const strStyles = `${CLASSNAME} { color: 'red'}`;

    // WHEN
    // THEN
    const prefixedStyles = prefixCssSelectors(strStyles, PREFIX_TAG);
    const prefixTagIndex = prefixedStyles.indexOf(PREFIX_TAG);
    const styleIndex = prefixedStyles.indexOf(CLASSNAME);
    expect(prefixTagIndex < styleIndex).toEqual(true);
  });

  it('should prefix styles with tag without duplication of tag', () => {
    // GIVEN
    const PREFIX_TAG = 'tag_prefix';
    const strStyles = ".mystyle { color: 'red'}";

    // WHEN
    let prefixedStyles = prefixCssSelectors(strStyles, PREFIX_TAG);

    // THEN
    const strContains = (str, tag) => str.indexOf(tag) > -1;
    const strExtractFromIndex = (str, idx) => str.slice(idx);
    let idx = null;
    let count = 0;
    while (strContains(prefixedStyles, PREFIX_TAG)) {
      count += 1;
      idx = prefixedStyles.indexOf(PREFIX_TAG);
      idx += PREFIX_TAG.length;
      prefixedStyles = strExtractFromIndex(prefixedStyles, idx);
    }

    expect(count).toEqual(1);
  });
});
