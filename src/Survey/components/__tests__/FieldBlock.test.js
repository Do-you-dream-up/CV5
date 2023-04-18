import '@testing-library/jest-dom';

import Field from '../../Field';
import FieldBlock from '../../FieldBlock';
import { render } from '@testing-library/react';

describe('FieldBlock', () => {
  test('renders children inside article if field is root', () => {
    const field = new Field({ isRoot: true });
    const { getByRole, getByTestId } = render(
      <FieldBlock field={field}>
        <div data-testid="child">Child Component</div>
      </FieldBlock>,
    );
    const articleElement = getByRole('article');
    expect(articleElement).toBeInTheDocument();
    const childElement = getByTestId('child');
    expect(childElement).toBeInTheDocument();
  });

  test('renders children inside div if field is not root', () => {
    const field = new Field({ isRoot: false });
    const { getByTestId } = render(
      <FieldBlock field={field}>
        <div data-testid="child">Child Component</div>
      </FieldBlock>,
    );
    const childElement = getByTestId('child');
    expect(childElement).toBeInTheDocument();
  });

  test('renders only one child component', () => {
    const field = new Field({ isRoot: true });
    const { container } = render(
      <FieldBlock field={field}>
        <div data-testid="child1">Child Component 1</div>
        <div data-testid="child2">Child Component 2</div>
      </FieldBlock>,
    );
    expect(container.childElementCount).toBe(1);
  });

  test('throws error if field prop is missing', () => {
    expect(() => render(<FieldBlock>Child Component</FieldBlock>)).toThrow(
      "Cannot read properties of undefined (reading 'isRoot')",
    );
  });
});
