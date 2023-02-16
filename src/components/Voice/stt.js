/**
 *
 */
export default new (class Stt {
  /**
   * Return action buton
   * @param {*} title
   * @param iconComponent
   * @param {*} action
   */
  getButtonAction = (title, iconComponent, action) => ({
    children: iconComponent,
    onClick: () => action(),
    type: 'button',
    variant: 'icon',
  });
})();
