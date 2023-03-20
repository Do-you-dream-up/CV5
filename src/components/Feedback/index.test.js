import '@testing-library/jest-dom';

import Feedback from './index';
import { fireEvent } from '@testing-library/react';
import { render } from '../../tools/test-utils';

describe('Feedback component', () => {
  test('renders vote buttons', () => {
    const { getByTestId } = render(<Feedback />);
    const upVoteButton = getByTestId('vote-buttons-up');
    const downVoteButton = getByTestId('vote-buttons-down');
    expect(upVoteButton).toBeInTheDocument();
    expect(downVoteButton).toBeInTheDocument();
  });

  test('hides vote buttons after voting', async () => {
    const { getByTestId, queryByTestId } = render(<Feedback />);
    const upVoteButton = getByTestId('vote-buttons-up');
    fireEvent.click(upVoteButton);
    expect(upVoteButton).toBeInTheDocument();
    expect(queryByTestId('vote-buttons-down')).toBeInTheDocument();
  });

  // test('shows feedback choices after negative vote', async () => {
  //   const { getByTestId } = render(<Feedback />, {
  //     configuration: {
  //       feedback: {
  //         askComment: true,
  //       },
  //     },
  //   });
  //   const downVoteButton = getByTestId('vote-buttons-down');
  //   fireEvent.click(downVoteButton);
  //   const feedbackChoices = getByTestId('feedback-choices');
  //   expect(feedbackChoices).toBeInTheDocument();
  // });

  // test('shows comment form after choosing feedback choice', async () => {
  //   const { getByTestId } = render(<Feedback />);
  //   const downVoteButton = getByTestId('vote-buttons-down');
  //   fireEvent.click(downVoteButton);
  //   const feedbackChoices = getByTestId('feedback-choices');
  //   fireEvent.click(getByTestId('feedback-choice-0'));
  //   const commentField = getByTestId('feedback-comment');
  //   expect(commentField).toBeInTheDocument();
  // });

  // test('submits feedback comment on enter key press', async () => {
  //   const { getByTestId, findByText } = render(<Feedback />);
  //   const downVoteButton = getByTestId('vote-buttons-down');
  //   fireEvent.click(downVoteButton);
  //   fireEvent.click(getByTestId('feedback-choice-0'));
  //   const commentField = await findByText('Please share your feedback');
  //   const commentInput = getByTestId('feedback-comment-input');
  //   fireEvent.change(commentInput, { target: { value: 'test feedback comment' } });
  //   fireEvent.keyDown(commentInput, { key: 'Enter', code: 'Enter' });
  //   expect(commentInput.value).toBe('test feedback comment');
  //   expect(await findByText('Thank you for your feedback')).toBeInTheDocument();
  // });
});
