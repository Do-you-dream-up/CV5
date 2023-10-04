import '@testing-library/jest-dom';

import Avatar from './Avatar';
import { render } from '../../tools/test-utils';

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

  test('Should render no Avat because no path or response type specified. Only Wrapper created', async () => {
    const { container } = render(<Avatar />);
    expect(container.children[0]).toHaveClass('dydu-avatar');
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(0);
  });

  test('Should render Avatar with request type from specified Path', async () => {
    const { container } = render(<Avatar path={path} type="request" />);
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });

  test('Should get avatars from configuration file when param |linkAvatarDependOnType| is /null and path is URL', async () => {
    mockConfiguration.avatar.response.image = 'path.png';
    const { container } = render(<Avatar type="response" linkAvatarDependOnType={linkAvatarDependOnType} />, {
      configuration: mockConfiguration,
    });
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
    expect(container.getElementsByClassName('dydu-avatar-image')[0].src).toContain(
      mockConfiguration.avatar.response.image,
    );
  });

  test('Should get avatars from configuration file when param |linkAvatarDependOnType| is /null and path is Base64', async () => {
    mockConfiguration.avatar.response.image = 'data:image/png;base64,iVBORw0KGgo';
    const { container } = render(<Avatar type="response" linkAvatarDependOnType={linkAvatarDependOnType} />, {
      configuration: mockConfiguration,
    });
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
    expect(container.getElementsByClassName('dydu-avatar-image')[0].src).toContain(
      mockConfiguration.avatar.response.image,
    );
  });
});
