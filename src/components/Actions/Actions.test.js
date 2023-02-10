import '@testing-library/jest-dom';

import Actions from './Actions';
import { render } from '../../tools/test-utils';

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
      className: 'submenu',
      variant: 'icon',
    },
  ];

  test('Should render no components because Array is empty', async () => {
    const renderElement = render(<Actions actions={[]} />);
    const { container } = renderElement;
    expect(container.firstChild).toBeNull();
  });

  test('Should render the same number of elements as the length of the argument array', async () => {
    const { container } = render(<Actions actions={actions} />);
    expect(container.children[0]).toHaveClass('dydu-actions');
    expect(container.getElementsByClassName('dydu-button').length).toBe(actions.length);
  });
});
