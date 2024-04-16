export default new (class Tts {
  /**
   * Return action buton
   * @param {*} title
   * @param {*} iconComponent
   * @param {*} action
   */
  getButtonAction = (title, iconComponent, action, rollOver) => ({
    children: iconComponent,
    onClick: () => action(),
    type: 'button',
    variant: 'icon',
    rollOver: rollOver,
  });
})();
