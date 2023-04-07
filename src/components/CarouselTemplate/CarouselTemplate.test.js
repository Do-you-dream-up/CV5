import '@testing-library/jest-dom';

import CarouselTemplate from './CarouselTemplate';
import { render } from '../../tools/test-utils';

xdescribe('CarouselTemplate.tsx', () => {
  const html = JSON.stringify({
    buttonA: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 1🦊 </a>',
    buttonB: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 2</a>',
    buttonC: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 3</a>',
    imageLink: 'https://app1.sandbox.doyoudreamup.com/servlet/gallery?galleryId=a9affc3f-97c1-4e6e-8acd-e2eda6d4cd90',
    imageName: null,
    numeric: null,
    subtitle: 'Lorem ipsum dolor sit amet. Est assumenda quam; ut libero debitis eum sapiente Lorem',
    text: 'Lorem ipsum dolor sit amet. Est assumenda quam; ut libero debitis eum sapiente Lorem',
    title: 'Birman',
    product: [
      {
        title: 'test1',
        subtitle: 'subtitle1',
        numeric: 1,
      },
    ],
  });
  test('Should render CarouselTemplate with empty json HTML', async () => {
    const { container } = render(<CarouselTemplate html={null} />);
    expect(container).toBeEmptyDOMElement();
  });
  test('Should render CarouselTemplate with HTML string', async () => {
    const { container } = render(<CarouselTemplate html={html} />);
    expect(container.getElementsByClassName('dydu-product-template').length).toBe(1);
  });
});
