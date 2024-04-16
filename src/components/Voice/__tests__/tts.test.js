import Tts from '../tts';
import axios from 'axios';

jest.mock('axios');

describe('Tts', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('getButtonAction', () => {
    it('returns a button action object with the correct properties', () => {
      const title = 'Test Button';
      const iconComponent = '<svg>Mock Icon</svg>';
      const action = jest.fn();

      const result = Tts.getButtonAction(title, iconComponent, action);

      expect(result).toEqual({
        children: iconComponent,
        onClick: expect.any(Function),
        type: 'button',
        variant: 'icon',
      });
      result.onClick();
      expect(action).toHaveBeenCalled();
    });
  });
});
