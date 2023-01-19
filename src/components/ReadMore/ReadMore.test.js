import '@testing-library/jest-dom';
import { render } from '../../tools/test-utils';

import ReadMore from './ReadMore';
describe('ReadMore.tsx', () => {
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec augue id massa finibus rhoncus eget a enim. Quisque volutpat magna justo, eu convallis nunc feugiat mollis. In in nisi vitae tellus cursus tempor non id lacus. Cras laoreet lectus condimentum leo sagittis imperdiet. Nam eu odio augue.';
  test('Should not render ReadMore with null children', async () => {
    const { container } = render(<ReadMore children={null} />);
    expect(container).toBeEmptyDOMElement();
  });
  test('Should render ReadMore with working truncated string', async () => {
    const { container } = render(<ReadMore children={lorem} isTruncated={true} />);
    expect(container.getElementsByClassName('dydu-readmore').length).toBe(1);
  });
  test('Should render ReadMore with working untruncated string', async () => {
    const { container } = render(<ReadMore children={lorem} isTruncated={false} />);
    expect(container.getElementsByClassName('dydu-readmore').length).toBe(1);
  });
});
