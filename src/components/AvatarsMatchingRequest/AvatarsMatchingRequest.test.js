import { render, screen } from '../../tools/test-utils';

import AvatarsMatchingRequest from './AvatarsMatchingRequest';

describe('AvatarsMatchingRequest', () => {
  it('should render nothing if neither showHeaderAvatar or showInteractionAvatar is true', () => {
    const { container } = render(<AvatarsMatchingRequest type="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render default avatar if no customAvatar and no typeResponse provided', () => {
    const { container } = render(<AvatarsMatchingRequest type="" defaultAvatar="default-avatar.png" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render data test id avatar when img is return', () => {
    let mockConfiguration = {
      header: {
        logo: {
          image: true,
        },
      },
    };
    const headerAvatar = true;

    render(<AvatarsMatchingRequest headerAvatar={headerAvatar} />, {
      configuration: mockConfiguration,
    });

    const element = screen.getByRole('img');

    expect(element).toBeTruthy();
  });

  it('should have typeresponse attribute and customAvatar', () => {
    let mockConfiguration = {
      header: {
        logo: {
          image: true,
          customAvatar: true,
        },
      },
    };

    render(<AvatarsMatchingRequest typeResponse="" />, {
      configuration: mockConfiguration,
    });
  });

  it('should render component with showInteractionAvatar is true', () => {
    let mockConfiguration = {
      avatar: {
        request: {
          enable: true,
        },
        response: {
          enable: true,
        },
      },
      header: {
        logo: {
          image: true,
          customAvatar: true,
        },
      },
    };
    const hasLoader = true;
    const carousel = false;
    const carouselTemplate = false;
    const linkAvatarDependOnType = '/null';
    const { container } = render(
      <AvatarsMatchingRequest
        hasLoader={hasLoader}
        carousel={carousel}
        carouselTemplate={carouselTemplate}
        linkAvatarDependOnType={linkAvatarDependOnType}
      />,
      {
        configuration: mockConfiguration,
      },
    );

    expect(container).toBeTruthy();
  });
});
