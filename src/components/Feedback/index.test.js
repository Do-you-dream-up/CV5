import Feedback from './';
import { render } from '../../tools/test-utils';

let botLanguages = ['en', 'fr'];

jest.mock('../../tools/dydu', () => ({
  __esModule: true,
  default: {
    feedback: jest.fn(),
    feedbackInsatisfaction: jest.fn(),
    feedbackComment: jest.fn(),
    talk: jest.fn(),
    setServerStatusCheck: jest.fn(),
    setSpaceToDefault: jest.fn(),
    setOidcLogin: jest.fn(),
    setLocale: jest.fn(),
    getBotLanguages: jest.fn(
      () =>
        new Promise((resolve) => {
          resolve(botLanguages);
        }),
    ),
  },
}));

describe('Feedback', () => {
  it('should render the vote buttons', () => {
    const { getByTestId } = render(<Feedback />, {
      configuration: {
        feedback: {
          active: true,
          askChoices: true,
          askComment: true,
        },
      },
    });
    const upVoteButton = getByTestId('vote-buttons-up');
    const downVoteButton = getByTestId('vote-buttons-down');

    expect(upVoteButton).toBeDefined();
    expect(downVoteButton).toBeDefined();
  });
});
