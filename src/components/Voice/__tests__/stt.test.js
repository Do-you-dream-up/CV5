import stt from '../stt';

describe('Stt', () => {
  test('getButtonAction returns object with properties when provided with valid parameters', () => {
    const title = 'Test Title';
    const iconComponent = <i className="fas fa-play"></i>;
    const action = () => console.log('Button clicked!');

    const buttonAction = stt.getButtonAction(title, iconComponent, action);

    expect(buttonAction).toHaveProperty('children', iconComponent);
    expect(buttonAction).toHaveProperty('onClick');
    expect(buttonAction).toHaveProperty('type', 'button');
    expect(buttonAction).toHaveProperty('variant', 'icon');
  });

  test('getButtonAction throws an error when provided with invalid parameters', () => {
    const title = null;
    const iconComponent = undefined;
    const action = 'not a function';

    expect(() => {
      stt.getButtonAction(title, iconComponent, action);
    }).toThrow();
  });
});
