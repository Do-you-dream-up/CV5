import '@testing-library/jest-dom';

import FileUploadButton from './FileUploadButton';
import { render } from '../../tools/test-utils';

describe('FileUploadButton', () => {
  it('render the FileUploadButton component', () => {
    const { getByTestId } = render(<FileUploadButton />);

    expect(getByTestId('file-upload-button')).toBeInTheDocument();
  });
});
