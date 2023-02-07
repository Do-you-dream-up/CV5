import '@testing-library/jest-dom';

import Footer from './Footer';
import { render } from '../../tools/test-utils';

describe('Footer', () => {
  it('render the input field and the translate icon when the hasTranslate flag is set', () => {
    const { getByTestId, getByAltText } = render(<Footer />);

    expect(getByTestId('footer-input')).toBeInTheDocument();
    expect(getByAltText('footer.translate')).toBeInTheDocument();
  });
  it('render the UploadInput component when the showConfirmSelectedFile context is NOT set', () => {
    const { getByTestId } = render(<Footer />);

    expect(getByTestId('footer-input')).toBeInTheDocument();
  });
});
