import Banner from './index';
import { render, screen, fireEvent } from '@testing-library/react';
import { useConfiguration } from '../../contexts/ConfigurationContext';

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

describe('Banner component', () => {
  const mockConfiguration = {
    banner: {
      active: true,
      dismissable: true,
      more: true,
      moreLink: 'https://example.com',
      storage: true,
      transient: true,
    },
  };
  useConfiguration.mockReturnValue({ configuration: mockConfiguration });
  it('renders banner when active is true', () => {
    render(<Banner />);
    screen.debug();
    screen.findByText('skeleton-paragraph').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('dismisses banner when clicked on OK button', () => {
    render(<Banner />);
    screen.debug();
    const okButton = screen.getByRole('button', { id: 'dydu-banner-ok' });

    fireEvent.click(okButton);
    screen.findByText('skeleton-paragraph').then((nodeElement) => expect(nodeElement).not.toBeInTheDocument());
  });

  it('disables opening of banner when storage is present', () => {
    render(<Banner />);
    expect(screen.getByTestId('banner')).toBeInTheDocument();
  });
});
