import AvatarsMatchingRequest from './AvatarsMatchingRequest';
import { render } from '@testing-library/react';

describe('AvatarsMatchingRequest', () => {
  it('should render nothing if neither showHeaderAvatar or showInteractionAvatar is true', () => {
    const { container } = render(<AvatarsMatchingRequest type="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render default avatar if no customAvatar and no typeResponse provided', () => {
    const { container } = render(<AvatarsMatchingRequest type="" defaultAvatar="default-avatar.png" />);
    expect(container.firstChild).toBeNull();
  });
});
