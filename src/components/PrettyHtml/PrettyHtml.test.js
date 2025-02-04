import '@testing-library/jest-dom';

import { render } from '../../tools/test-utils';
import PrettyHtml from "./index";

describe('PrettyHtml', () => {
    it('should render simple text sent or reveived without quotations marks', () => {
        const { getByText } = render(<PrettyHtml html={'Je suis un texte dans une bulle de requête ou de réponse'}/>);
        expect(() => getByText('"Je suis un texte dans une bulle de requête ou de réponse"')).toThrowError();
    });
});