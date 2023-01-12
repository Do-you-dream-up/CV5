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

  jest.mock('../../contexts/ConfigurationContext', () => ({
    useConfiguration: jest.fn().mockReturnValue({ configuration: mockConfiguration }),
  }));

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
    const { container } = render(<Avatar type="request" linkAvatarDependOnType={linkAvatarDependOnType} />);
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });
  test('Load component with no path and type is request and images are Base64', async () => {
    mockConfiguration.avatar.request.image = 'data:image/png;base64,iVBORw0KGgo';
    mockConfiguration.avatar.response.image = 'data:image/png;base64,iVBORw0KGgo';
    const { container } = render(<Avatar type="request" linkAvatarDependOnType={linkAvatarDependOnType} />);
    expect(container.getElementsByClassName('dydu-avatar-image').length).toBe(1);
  });
});
