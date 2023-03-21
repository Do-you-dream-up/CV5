import Carousel from './Carousel';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

describe('Carousel', () => {
  const children = [<div key={1}>Child 1</div>, <div key={2}>Child 2</div>, <div key={3}>Child 3</div>];
  const steps = [
    { sidebar: { content: 'Sidebar content' } },
    { sidebar: { content: 'Sidebar content' } },
    { sidebar: { content: 'Sidebar content' } },
  ];
  const templateName = 'templateName';
  const className = 'className';

  it('renders the carousel with children and controls', () => {
    const { getByText, getByTestId } = render(
      <Carousel children={children} steps={steps} templateName={templateName} className={className} />,
    );
    expect(getByText('Child 1')).toBeDefined();
    expect(getByText('Child 2')).toBeDefined();
    expect(getByText('Child 3')).toBeDefined();
    expect(getByTestId('dydu-arrow-left')).toBeDefined();
    expect(getByTestId('dydu-arrow-right')).toBeDefined();
  });

  it('renders the carousel with bullets', () => {
    const { getByTestId } = render(
      <Carousel children={children} steps={steps} templateName={templateName} className={className} />,
    );
    expect(getByTestId('dydu-carousel-bullets')).toBeDefined();
  });

  it('clicks an inactive bullet and updates the active slide', () => {
    const { getByTestId, getByText } = render(
      <Carousel children={children} steps={steps} templateName={templateName} className={className} />,
    );
    const inactiveBullet = getByTestId('dydu-carousel-bullet-1'); // get an inactive bullet element
    expect(inactiveBullet).toBeDefined();
    fireEvent.click(inactiveBullet); // click the inactive bullet element
    expect(getByText('Child 2')).toBeDefined(); // expect the second slide to become active
  });

  it('renders the carousel with steps', () => {
    const { getByTestId } = render(
      <Carousel children={children} steps={steps} templateName={templateName} className={className} />,
    );
    expect(getByTestId('dydu-carousel-steps')).toBeDefined();
  });

  it('triggers the next and previous controls', () => {
    const { getByTestId, getByText } = render(
      <Carousel children={children} steps={steps} templateName={templateName} className={className} />,
    );
    fireEvent.click(getByTestId('dydu-arrow-right'));
    expect(getByText('Child 2')).toBeDefined();
    fireEvent.click(getByTestId('dydu-arrow-left'));
    expect(getByText('Child 1')).toBeDefined();
  });
});
