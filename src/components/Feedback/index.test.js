import Feedback from './';
import { render } from '../../tools/test-utils';

describe('Feedback', () => {
  it('should render the vote buttons', () => {
    const { getByTestId } = render(<Feedback />);
    const upVoteButton = getByTestId('vote-buttons-up');
    const downVoteButton = getByTestId('vote-buttons-down');

    expect(upVoteButton).toBeDefined();
    expect(downVoteButton).toBeDefined();
  });
});
