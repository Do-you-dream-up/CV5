import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Contacts from './index';

describe('Contacts', () => {
  it('should render ContactsList component', () => {
    const mockConfiguration = {
      contacts: {
        socialNetwork: true,
      },
    };

    const { container } = render(<Contacts />, { configuration: mockConfiguration });
    expect(container.querySelector('social')).toBeDefined();
  });

  it('should render ContactsList component with `phone` id', () => {
    const mockConfiguration = {
      contacts: {
        phone: true,
      },
    };
    const { container } = render(<Contacts />, { configuration: mockConfiguration });
    console.log(container);
    expect(container.querySelector('phone')).toBeDefined();
  });

  it('should NOT render ContactsList component with `phone` id', () => {
    const mockConfiguration = {
      contacts: {
        phone: false,
      },
    };
    const { container } = render(<Contacts />, { configuration: mockConfiguration });
    expect(container.querySelector('phone')).toBeNull();
  });
});
