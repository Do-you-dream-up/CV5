import '@testing-library/jest-dom';

import useCustomRenderer, {
  createFunctionWithString,
  getFilters,
  replaceExternalSingleQuotesByDoubleQuotes,
} from './useCustomRenderer';

import { render } from '@testing-library/react';
import { useDialog } from '../../contexts/DialogContext';

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest.fn(() => ({ setZoomSrc: jest.fn() })),
}));

describe('useCustomRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should replace a div with a span', () => {
    const customRenderer = useCustomRenderer();
    const divProps = { name: 'div', children: 'Hello World!' };

    const { container } = render(<div {...divProps} />);

    expect(container.firstChild.tagName.toLowerCase()).toBe('div');

    customRenderer.replace(divProps);

    expect(useDialog().setZoomSrc).not.toHaveBeenCalled();
    expect(getFilters).toBeTruthy();
  });

  it('should not replace anything if no filter matches', () => {
    const customRenderer = useCustomRenderer();
    const pProps = { name: 'p', children: 'Hello World!' };

    const { container } = render(<p {...pProps} />);

    expect(container.firstChild.tagName.toLowerCase()).toBe('p');

    customRenderer.replace(pProps);

    expect(container.firstChild.tagName.toLowerCase()).toBe('p');
    expect(useDialog().setZoomSrc).not.toHaveBeenCalled();
    expect(getFilters).toBeTruthy();
  });
  describe('replaceExternalSingleQuotesByDoubleQuotes', () => {
    test('should replace single quotes with double quotes', () => {
      //GIVEN
      const input = "I am using 'single' quotes in this sentence";
      const expectedOutput = 'I am using "single" quotes in this sentence';

      //WHEN
      const result = replaceExternalSingleQuotesByDoubleQuotes(input);

      //THEN
      expect(result).toEqual(expectedOutput);
    });

    test('should return empty string if input is undefined or null', () => {
      //GIVEN
      const inputUndefined = undefined;
      const inputNull = null;

      //WHEN
      const resultUndefined = replaceExternalSingleQuotesByDoubleQuotes(inputUndefined);
      const resultNull = replaceExternalSingleQuotesByDoubleQuotes(inputNull);

      //THEN
      expect(resultUndefined).toEqual('');
      expect(resultNull).toEqual('');
    });

    test('should return the input string if there are no external single quotes', () => {
      //GIVEN
      const input = 'This string does not have any single quotes';

      //WHEN
      const result = replaceExternalSingleQuotesByDoubleQuotes(input);

      //THEN
      expect(result).toEqual(input);
    });
  });

  describe('createFunctionWithString', () => {
    test('should create a function from a valid function string', () => {
      const bodyFuncString = 'return a + b';
      const expectedOutput = expect.any(Function);
      const output = createFunctionWithString(bodyFuncString);
      expect(output).toEqual(expectedOutput);
    });

    test('should replace external single quotes in invalid function string and create a function', () => {
      const bodyFuncString = 'return a + b';
      const expectedOutput = expect.any(Function);
      const output = createFunctionWithString(bodyFuncString);
      expect(output).toEqual(expectedOutput);
    });

    test('should return the input string if it cannot create a function', () => {
      const bodyFuncString = 'invalid code';
      const expectedOutput = bodyFuncString;
      const output = createFunctionWithString(bodyFuncString);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('getFilters', () => {
    test('should return an array of two objects', () => {
      const utils = { setZoomSrc: jest.fn() };
      const filters = getFilters(utils);
      expect(Array.isArray(filters)).toBe(true);
      expect(filters).toHaveLength(2);
      expect(typeof filters[0]).toBe('object');
      expect(typeof filters[1]).toBe('object');
    });

    test('should return an array of objects with test and process properties', () => {
      const utils = { setZoomSrc: jest.fn() };
      const filters = getFilters(utils);
      expect(filters[0]).toHaveProperty('test');
      expect(typeof filters[0].test).toBe('function');
      expect(filters[0]).toHaveProperty('process');
      expect(typeof filters[0].process).toBe('function');

      expect(filters[1]).toHaveProperty('test');
      expect(typeof filters[1].test).toBe('function');
      expect(filters[1]).toHaveProperty('process');
      expect(typeof filters[1].process).toBe('function');
    });

    test('should correctly filter anchor tags', () => {
      const utils = { setZoomSrc: jest.fn() };
      const filters = getFilters(utils);
      const filter = filters[0];

      // Test a match
      const testProps = { name: 'a' };
      const testResult = filter.test(testProps);
      expect(testResult).toBe(true);

      // Test a non-match
      const nonTestProps = { name: 'b' };
      const nonTestResult = filter.test(nonTestProps);
      expect(nonTestResult).toBe(false);
    });

    test('should correctly filter image tags', () => {
      const utils = { setZoomSrc: jest.fn() };
      const filters = getFilters(utils);
      const filter = filters[1];

      // Test a match
      const testProps = { name: 'img' };
      const testResult = filter.test(testProps);
      expect(testResult).toBe(true);

      // Test a non-match
      const nonTestProps = { name: 'b' };
      const nonTestResult = filter.test(nonTestProps);
      expect(nonTestResult).toBe(false);
    });
    test('should process anchor tag with onclick attribute', () => {
      const utils = { setZoomSrc: jest.fn() };
      const props = {
        name: 'a',
        attribs: { onclick: 'alert("test")' },
        children: 'Link Text',
      };

      const [filter] = getFilters(utils);
      const result = filter.process(props);

      expect(result).toEqual(<a onClick={expect.any(Function)}>{props.children}</a>);

      expect(utils.setZoomSrc).not.toHaveBeenCalled();
    });

    test('should process img tag with src attribute', () => {
      const utils = { setZoomSrc: jest.fn() };
      const props = {
        name: 'img',
        attribs: { src: 'image.jpg' },
        children: null,
      };

      const [, filter] = getFilters(utils);
      const result = filter.process(props);

      expect(result).toEqual({
        name: 'img',
        attribs: { onClick: expect.any(Function), src: 'image.jpg' },
        children: null,
      });
      expect(utils.setZoomSrc).not.toHaveBeenCalled();
    });
  });
});
