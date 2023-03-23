import { fireEvent, screen } from '@testing-library/react';

import Footer from './';
import { render } from '../../tools/test-utils';

describe('Footer', () => {
  const onRequest = jest.fn();
  const onResponse = jest.fn();

  it('renders the input field', () => {
    const { container } = render(<Footer onRequest={onRequest} onResponse={onResponse} />);
    expect(container.getElementsByClassName('dydu-footer')).toBeDefined();
  });

  it('renders the language selector', () => {
    const { container } = render(<Footer onRequest={onRequest} onResponse={onResponse} />, {
      configuration: {
        application: {
          defaultLanguage: ['fr', 'en'],
        },
        footer: {
          translate: true,
        },
      },
    });
    expect(container.getElementsByClassName('language-selector-icon')).toBeDefined();
  });
});
