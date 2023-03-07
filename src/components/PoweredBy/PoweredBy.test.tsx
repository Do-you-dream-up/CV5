import '@testing-library/jest-dom';

import PoweredBy from './PoweredBy';
import { render } from '../../tools/test-utils';

describe('PoweredBy', () => {
  it('should render Powered BY', () => {
    const { getByText } = render(<PoweredBy />);
    expect(getByText('powered by'));
  });
});
