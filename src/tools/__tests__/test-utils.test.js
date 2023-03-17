/* eslint-disable react/prop-types */
import { ProviderWrapper, setupFetchStub } from '../test-utils';
import { render, screen } from '@testing-library/react';

test('setupFetchStub returns a function that resolves with the provided data', async () => {
  const data = { foo: 'bar' };
  const fetchStub = setupFetchStub(data);
  const response = await fetchStub('https://example.com');

  expect(response).toEqual({
    json: expect.any(Function),
  });

  const json = await response.json();
  expect(json).toEqual({ data });
});

describe('ProviderWrapper', () => {
  it('renders its children with the expected providers', () => {
    const childText = 'Hello, world!';
    render(
      <ProviderWrapper>
        <div>{childText}</div>
      </ProviderWrapper>,
    );

    expect(screen.getByText(childText)).toBeDefined();
  });
});

describe('customRender', () => {
  it('renders a component with the provided custom props', () => {
    const CustomComponent = ({ customProp }) => <div>{customProp}</div>;

    render(<CustomComponent customProp="Custom value" />, {
      customProp: { configuration: {}, theme: {} },
    });

    expect(screen.getByText('Custom value')).toBeDefined();
  });
});
