import { fireEvent, render, screen } from '@testing-library/react';

import Banner from './Banner';
import { ConfigurationFixture } from '../../test/fixtures/configuration';
import { useConfiguration } from '../../contexts/ConfigurationContext';

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

describe('Banner component', () => {
  let configuration;
  beforeEach(() => {
    configuration = {
      banner: {
        active: true,
        dismissable: true,
        more: true,
        moreLink: 'https://example.com',
        storage: true,
        transient: true,
      },
    };
    useConfiguration.mockReturnValue({ configuration });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('dismisses banner when clicked on OK button', () => {
    render(<Banner />);
    const okButton = screen.getByRole('button', { id: 'dydu-banner-ok' });

    fireEvent.click(okButton);
    screen.findByText('skeleton-paragraph').then((nodeElement) => expect(nodeElement).not.toBeInTheDocument());
  });

  it('renders banner when active is true', () => {
    render(<Banner />);
    screen.findByText('skeleton-paragraph').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });

  it('should render dismiss option with button ', () => {
    const newConfig = new ConfigurationFixture();
    newConfig.dismissableBanner;
    useConfiguration.mockReturnValue({ configuration: newConfig.getConfiguration() });
    render(<Banner />);
    screen.findByText('dydu-banner-ok').then((nodeElement) => expect(nodeElement).toBeInTheDocument());
  });
});
