import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '../../tools/test-utils';

import Actions from '../Actions/Actions';

describe('Actions.tsx', () => {
  const onClick = (text) => () => alert(text);

  const items = [
    [
      { onClick: onClick('One!'), text: 'One' },
      { onClick: onClick('Two!'), text: 'Two' },
      { onClick: onClick('Three!'), text: 'Three' },
    ],
  ];

  const actions = [
    {
      children: <img src="icons/thumb-up.png" />,
      color: 'primary',
      onClick: onClick('Foo!'),
      variant: 'icon',
    },
    {
      children: <img src="icons/thumb-down.png" />,
      color: 'primary',
      onClick: onClick('Bar!'),
      variant: 'icon',
    },
    {
      children: <img src="icons/dots-vertical.png" />,
      color: 'primary',
      items: () => items,
      variant: 'icon',
    },
  ];

  test('Load component with no actions', async () => {
    const { container } = render(<Actions actions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('Load component with actions', async () => {
    const { container } = render(<Actions actions={actions} />);
    expect(container.getElementsByClassName('dydu-actions').length).toBe(1);
  });

  test('Load component with actions', async () => {
    const { container } = render(<Actions actions={actions} />);
    expect(container.getElementsByClassName('dydu-actions').length).toBe(1);
  });
});
