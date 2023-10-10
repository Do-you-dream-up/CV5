import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Menu from './Menu';

jest.mock('../../contexts/UserActionContext', () => ({
  useUserAction: () => ({ shiftPressed: false }),
}));

describe('Menu component', () => {
  const items = [
    [
      { icon: 'icon1.png', onClick: jest.fn(), text: 'Item 1' },
      { icon: 'icon2.png', onClick: jest.fn(), text: 'Item 2' },
    ],
  ];
  const selected = 'Item 1';

  it('renders without errors', () => {
    render(<Menu items={items} selected={selected} data-testid="menu" />);
    const menu = screen.getByTestId('menu');
    fireEvent.click(menu);
    expect(screen.getByText('Item 1')).toBeDefined();
    fireEvent.click(document.body);
    setTimeout(() => expect(screen.getByText('Item 1')).not.toBeInTheDocument(), 2000);
  });
});
