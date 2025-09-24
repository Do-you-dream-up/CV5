import '@testing-library/jest-dom';

import { render } from '../../tools/test-utils';
import PrettyHtml from './index';

describe('PrettyHtml', () => {
  it('should render simple text sent or reveived without quotations marks', () => {
    const { getByText } = render(<PrettyHtml html={'Je suis un texte dans une bulle de requête ou de réponse'} />);
    expect(() => getByText('"Je suis un texte dans une bulle de requête ou de réponse"')).toThrowError();
  });
  it('ajoute aria-label avec le texte du lien', () => {
    const html = `<a href="https://youtube.com" class="my-link" target="_blank">liens vers youtube</a>`;
    const { container } = render(<PrettyHtml html={html} />);
    const link = container.querySelector('a');
    expect(link?.outerHTML).toBe(
      `<a href="https://youtube.com" class="my-link" target="_blank" aria-label="liens vers youtube">liens vers youtube</a>`,
    );
  });
  it('ajoute aria-label avec guillemets échappés quand templatename vaut QUICK_REPLY', () => {
    const html = `<a href="https://youtube.com" class="my-link" target="_blank">liens vers youtube</a>`;
    const { container } = render(<PrettyHtml html={html} templatename="QUICK_REPLY" />);
    const link = container.querySelector('a');
    expect(link?.outerHTML).toBe(
      `<a href="https://youtube.com" class="my-link" target="_blank" aria-label="liens vers youtube">liens vers youtube</a>`,
    );
  });
  it('ajoute aria-label à tous les liens quand plusieurs balises a', () => {
    const html = `
    <div>
      <a href="https://google.com" class="my-link" target="_blank">Google</a>
      <a href="https://youtube.com" class="my-link" target="_blank">YouTube</a>
    </div>
  `;
    const { container } = render(<PrettyHtml html={html} />);
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].outerHTML).toBe(
      `<a href="https://google.com" class="my-link" target="_blank" aria-label="Google">Google</a>`,
    );
    expect(links[1].outerHTML).toBe(
      `<a href="https://youtube.com" class="my-link" target="_blank" aria-label="YouTube">YouTube</a>`,
    );
  });
});
