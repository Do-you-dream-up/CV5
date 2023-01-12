import '@testing-library/jest-dom';

import Avatar from './Avatar';
import { render } from '../../tools/test-utils';

describe('Avatar.tsx', () => {
  test('Load component with wrapper', async () => {
    const { container } = render(<Avatar />);
    expect(container.children[0]).toHaveClass('dydu-avatar');
  });
});
