import Carousel from './Carousel';
import { getAllByText } from '@testing-library/react';
import { render } from '../../tools/test-utils';

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest.fn().mockReturnValue({ sidebarActive: true }),
}));

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  const children = [<div key={1}>Child 1</div>, <div key={2}>Child 2</div>, <div key={3}>Child 3</div>];
  const steps = [
    { sidebar: { content: 'Sidebar content' } },
    { sidebar: { content: 'Sidebar content' } },
    { sidebar: { content: 'Sidebar content' } },
  ];

  it('renders the carousel with children and steps and verify each div', () => {
    const { getAllByText } = render(<Carousel children={children} steps={steps} />);
    expect(getAllByText('Child 1')).toBeDefined();
    expect(getAllByText('Child 2')).toBeDefined();
    expect(getAllByText('Child 3')).toBeDefined();
  });
});
