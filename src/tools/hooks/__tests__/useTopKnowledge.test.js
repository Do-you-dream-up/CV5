import useTopKnowledge, { extractPayload } from '../useTopKnowledge';

import dydu from '../../../tools/dydu';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../../contexts/ConfigurationContext', () => ({
  useConfiguration: () => ({ configuration: { top: { period: 'month', size: 10 } } }),
}));

describe('useTopKnowledge', () => {
  it('should call dydu.top and set result', () => {
    const knowledgeList = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];

    // jest.spyOn est utilisé pour simuler la fonction `dydu.top` et retourner les données de test
    jest.spyOn(dydu, 'top').mockResolvedValue({ knowledgeArticles: JSON.stringify(knowledgeList) });

    const { result } = renderHook(() => useTopKnowledge());

    expect(result.current.result).toEqual([]);
    setTimeout(() => {
      expect(dydu.top).toHaveBeenCalledWith('month', 10);
      expect(result.current.result).toEqual(knowledgeList);
    }, 500);
  });
  it('should call dydu.top and set result', async () => {
    const knowledgeList = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];

    // jest.spyOn est utilisé pour simuler la fonction `dydu.top` et retourner les données de test
    jest.spyOn(dydu, 'top').mockResolvedValue({ knowledgeArticles: JSON.stringify(knowledgeList) });

    const { result } = renderHook(() => useTopKnowledge());

    expect(result.current.result).toEqual([]);
    await result.current.fetch();
    expect(dydu.top).toHaveBeenCalledWith('month', 10);
    expect(result.current.result).toEqual(knowledgeList);
  });

  it('should catch and handle errors', () => {
    setTimeout(() => {
      // jest.spyOn est utilisé pour simuler la fonction `dydu.top` et renvoyer une erreur
      jest.spyOn(dydu, 'top').mockRejectedValue(new Error('Fetch error'));
    }, 500);
    const { result } = renderHook(() => useTopKnowledge());
    setTimeout(() => {
      expect(result.current.result).toEqual([]);
      expect(result.current.fetch()).rejects.toThrow('Fetch error');
      expect(dydu.top).toHaveBeenCalledWith('month', 10);
      expect(result.current.result).toEqual([]);
    }, 500);
  });
});

describe('extractPayload', () => {
  it('should parse and return array of knowledgeArticles', () => {
    const knowledgeList = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];
    const response = { knowledgeArticles: JSON.stringify(knowledgeList) };

    expect(extractPayload(response)).toEqual(knowledgeList);
  });

  it('should parse and return single knowledgeArticle', () => {
    const knowledgeArticle = { id: 1, title: 'Article 1' };
    const response = { knowledgeArticles: JSON.stringify(knowledgeArticle) };

    expect(extractPayload(response)).toEqual([knowledgeArticle]);
  });

  it('should return an empty array when an error occurs', () => {
    const response = {
      knowledgeArticles: undefined,
    };

    const result = extractPayload(response);

    expect(result).toEqual([]);
  });
});
