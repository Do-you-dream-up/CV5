import '@testing-library/jest-dom';

import Carousel from './Carousel';
import { render } from '../../tools/test-utils';

xdescribe('Carousel.tsx', () => {
  const children = ['<p>item</p>', '<p>item</p>', '<p>item</p>'];

  test('Should render Carousel with nothing to display', async () => {
    const { container } = render(<Carousel />);
    expect(container.getElementsByClassName('dydu-carousel-steps')[0]).toBeEmptyDOMElement();
  });
  test('Should render Carousel with children array of children to display', async () => {
    const { container } = render(<Carousel children={children} />);
    expect(container.getElementsByClassName('dydu-carousel-step').length).toBe(children.length);
  });

  test('Should render Carousel with children array of children to display and controls to navigate and bullets, with right number of bullets', async () => {
    const { container } = render(<Carousel children={children} />, {
      configuration: { carousel: { bullets: true, controls: true } },
    });
    expect(container.getElementsByClassName('dydu-carousel-step').length).toBe(children.length);
    expect(container.getElementsByClassName('dydu-carousel-bullets').length).toBe(1);
    expect(container.getElementsByClassName('dydu-carousel-bullet').length).toBe(children.length);
    expect(container.getElementsByClassName('dydu-carousel-controls').length).toBe(2);
  });

  test('Should render Carousel with children array of children to display and no controls and no bullets', async () => {
    const { container } = render(<Carousel children={children} />, {
      configuration: { carousel: { bullets: false, controls: false } },
    });
    expect(container.getElementsByClassName('dydu-carousel-step').length).toBe(children.length);
    expect(container.getElementsByClassName('dydu-carousel-bullets').length).toBe(0);
    expect(container.getElementsByClassName('dydu-carousel-bullet').length).toBe(0);
    expect(container.getElementsByClassName('dydu-carousel-controls').length).toBe(0);
  });

  test('Should render Carousel with secondary active', async () => {
    jest.mock('../../contexts/DialogContext', () => ({
      useDialog: jest.fn().mockReturnValue({ secondaryActive: true, toggleSecondary: jest.fn() }),
    }));
    const { container } = render(<Carousel children={children} />);
    expect(container.getElementsByClassName('dydu-carousel-step').length).toBe(children.length);
  });
});
