import '@testing-library/jest-dom';

import UploadInput from './UploadInput';
import { render } from '../../tools/test-utils';

describe('UploadInput', () => {
  it('render the UploadInput component', () => {
    const { getByTestId } = render(<UploadInput />);

    expect(getByTestId('footer-upload-input')).toBeInTheDocument();
  });
});
