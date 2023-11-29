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
  getButtonAction = (title, iconComponent, action, rollOver) => {
    if (typeof action !== 'function') throw new Error('Action is not a function');

    return {
      children: iconComponent,
      onClick: () => action(),
      type: 'button',
      variant: 'icon',
      rollOver: rollOver,
    };
  };
})();
