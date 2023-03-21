import MenuList from './';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

describe('MenuList', () => {
  const items = [
    { icon: 'icon1.png', onClick: jest.fn(), text: 'Item 1' },
    { icon: 'icon2.png', onClick: jest.fn(), text: 'Item 2' },
    { icon: 'icon3.png', onClick: jest.fn(), text: 'Item 3', when: false },
  ];
  const onClose = jest.fn();
  const selected = 'Item 1';

  it('renders the list items', () => {
    const { getByText } = render(<MenuList items={items} onClose={onClose} selected={selected} />);
    expect(getByText('Item 1')).toBeDefined();
    expect(getByText('Item 2')).toBeDefined();
  });

  it('calls the onClick function when an item is clicked', () => {
    const { getByText } = render(<MenuList items={items} onClose={onClose} selected={selected} />);
    fireEvent.click(getByText('Item 1'));
    expect(items[0].onClick).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls the onClick function when an item is selected with the keyboard', () => {
    const { getByText } = render(<MenuList items={items} onClose={onClose} selected={selected} />);
    fireEvent.keyDown(getByText('Item 1'), { keyCode: 13 });
    expect(items[0].onClick).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call the onClick function when an item is clicked and has no callback', () => {
    const updatedList = items.map((i) => {
      return { ...i, when: true };
    });
    const { getByText } = render(<MenuList items={updatedList} onClose={onClose} selected={selected} />);
    fireEvent.click(getByText('Item 3'));
    expect(items[2].onClick).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
