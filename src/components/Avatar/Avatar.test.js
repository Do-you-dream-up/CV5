import '@testing-library/jest-dom';
import { render } from '../../tools/test-utils';

import Avatar from './Avatar';
describe('Avatar.tsx', () => {
  const path = 'https://www.google.fr';
  const linkAvatarDependOnType = '/null';

  let mockConfiguration = {
    avatar: {
      request: {
        image: null,
      },
      response: {
        image: null,
      },
    },
  };

  test('Load component with wrapper', async () => {
    const { container } = render(<Avatar />);
    expect(container.children[0]).toHaveClass('dydu-avatar');
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(0);
  });
  test('Load component with correct path and type is request', async () => {
    const { container } = render(<Avatar path={path} type="request" />);
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });
  test('Load component with no path and type is request and images are path', async () => {
    mockConfiguration.avatar.request.image = 'path.png';
    mockConfiguration.avatar.response.image = 'path.png';
    const { container } = render(<Avatar type="request" linkAvatarDependOnType={linkAvatarDependOnType} />, {
      configuration: mockConfiguration,
    });
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });
  test('Load component with no path and type is request and images are Base64', async () => {
    mockConfiguration.avatar.request.image = 'data:image/png;base64,iVBORw0KGgo';
    mockConfiguration.avatar.response.image = 'data:image/png;base64,iVBORw0KGgo';
    const { container } = render(<Avatar type="request" linkAvatarDependOnType={linkAvatarDependOnType} />, {
      configuration: mockConfiguration,
    });
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });
});
