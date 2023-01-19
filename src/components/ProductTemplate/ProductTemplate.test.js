import '@testing-library/jest-dom';
import { render } from '../../tools/test-utils';

import ProductTemplate from './ProductTemplate';
describe('ProductTemplate.tsx', () => {
  const json = JSON.stringify({
    product: {
      buttonA: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 1🐱 </a>',
      buttonB: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 2</a>',
      buttonC: '<a href="https://www.larousse.fr/encyclopedie/divers/chat/185548">Bouton 3</a>',
      imageLink: 'https://app1.sandbox.doyoudreamup.com/servlet/gallery?galleryId=2a3fda3d-7de5-497f-97ab-164e51762c53',
      imageName: null,
      numeric: null,
      subtitle: "Limitez la description à 85 caractères (espace compris) pour l'afficher en entier !!!",
      title: 'Bombay',
    },
  });
  test('Should not render ProductTemplate because no html as props', async () => {
    const { container } = render(<ProductTemplate children={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('Should render ProductTemplate because html as props', async () => {
    const { container } = render(<ProductTemplate html={json} />);
    expect(container.getElementsByClassName('dydu-product-template').length).toBe(1);
  });
});
