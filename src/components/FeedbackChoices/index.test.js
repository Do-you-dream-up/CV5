import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import FeedbackChoices from '../FeedbackChoices';

jest.mock('i18next', () => {
  return {
    use: function () {
      return this;
    },
    init: function () {
      return this;
    },
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'feedback.choices') {
        return ['choice 1', 'choice 2'];
      }
      if (key === 'feedback.question') {
        return 'What is your feedback about?';
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('FeedbackChoices', () => {
  test('renders choices and calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    const choices = ['choice 1', 'choice 2'];
    const question = 'What is your feedback about?';

    render(<FeedbackChoices onSelect={mockOnSelect} />);

    expect(screen.getByText(question)).toBeInTheDocument();

    choices.forEach((choice) => {
      expect(screen.getByText(choice)).toBeInTheDocument();
    });

    const choiceElement = screen.getByText(choices[0]);
    fireEvent.click(choiceElement);

    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  test('renders nothing when choices are empty', () => {
    const mockOnSelect = jest.fn();
    const choices = [];
    const question = '<p>What is your feedback about?</p>';

    render(<FeedbackChoices onSelect={mockOnSelect} />);

    expect(screen.queryByText(question)).toBeNull();

    choices.forEach((choice) => {
      expect(screen.queryByText(choice)).toBeNull();
    });
  });
});
