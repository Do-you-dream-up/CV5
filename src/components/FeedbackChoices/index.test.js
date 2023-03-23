import '@testing-library/jest-dom';

import FeedbackChoices from './';
import { render } from '../../tools/test-utils';
import { screen } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'feedback.choices') {
        return ['choice 1', 'choice 2'];
      } else if (key === 'feedback.question') {
        return 'What is your feedback about?';
      } else {
        return key;
      }
    },
  }),
}));

describe('FeedbackChoices', () => {
  test('renders choices', () => {
    const onSelect = jest.fn();
    render(<FeedbackChoices onSelect={onSelect} />);
    expect(screen.getByText('What is your feedback about?')).toBeInTheDocument();
    expect(screen.getByText('choice 1')).toBeInTheDocument();
    expect(screen.getByText('choice 2')).toBeInTheDocument();
  });
});
