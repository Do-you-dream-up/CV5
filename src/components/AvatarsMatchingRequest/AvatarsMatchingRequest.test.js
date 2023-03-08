import { render, screen } from '../../tools/test-utils';

import AvatarsMatchingRequest from './AvatarsMatchingRequest';

describe('AvatarsMatchingRequest', () => {
  let mockConfiguration = {
    header: {
      logo: {
        image: true,
      },
    },
  };
  it('should render nothing if neither showHeaderAvatar or showInteractionAvatar is true', () => {
    const { container } = render(<AvatarsMatchingRequest type="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render default avatar if no customAvatar and no typeResponse provided', () => {
    const { container } = render(<AvatarsMatchingRequest type="" defaultAvatar="default-avatar.png" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render data test id avatar when img is return', () => {
    const headerAvatar = true;

    render(<AvatarsMatchingRequest headerAvatar={headerAvatar} />, {
      configuration: mockConfiguration,
    });

    const element = screen.getByAltText('avatar');

    expect(element).toBeTruthy();
  });
});
