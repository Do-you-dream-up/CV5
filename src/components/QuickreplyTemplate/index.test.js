import QuickreplyTemplate from './';
import { render } from '../../tools/test-utils';
import { newObjectSort } from './';

describe('QuickreplyTemplate', () => {
  it('renders null if html is not defined', () => {
    const { container } = render(<QuickreplyTemplate />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null if html is not a valid JSON object', () => {
    const { container } = render(<QuickreplyTemplate html="not a JSON object" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the text content if it exists', () => {
    const { getByText } = render(<QuickreplyTemplate html='{"quick": {"button1": "Hello World"}}' />);
    expect(getByText('Hello World')).toBeDefined();
  });

  it('renders the quick reply buttons if they exist', () => {
    const { getByText } = render(
      <QuickreplyTemplate html='{"quick": {"button1": "Button 1", "button2": "Button 2"}}' />,
    );
    expect(getByText('Button 1')).toBeDefined();
    expect(getByText('Button 2')).toBeDefined();
  });
  it('devrait trier un objet correctement en fonction de la clé numérique à l’aide de newObjectSort', () => {
    const contentQuick = {
      quick4: 'Bouton 3',
      quick1: 'Bouton 1',
      quick2: 'Bouton 2',
      quick12: 'Bouton 12',
    };
    const newObjectSort = (obj, fn) => {
      return Object.keys(obj).reduce((acc, k) => {
        acc[fn(obj[k], k, obj)] = obj[k];
        return acc;
      }, {});
    };

    const sortFn = (val, key) => {
      return parseInt(key.match(/\d+/));
    };

    const sorted = newObjectSort(contentQuick, sortFn);

    const expectedKeys = ['1', '2', '4', '12'];
    expect(Object.keys(sorted)).toEqual(expectedKeys);

    expect(sorted['1']).toBe('Bouton 1');
    expect(sorted['2']).toBe('Bouton 2');
    expect(sorted['4']).toBe('Bouton 3');
    expect(sorted['12']).toBe('Bouton 12');
  });
});
