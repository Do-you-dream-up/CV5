import React from 'react';

/**
 *
 */
export default new class Stt {
  /**
   * Return action buton
   * @param {*} tite
   * @param {*} iconName
   * @param {*} action
   */
     getButtonAction = (tite, iconName, action) => {
        const button = {
            children: <img alt={tite} src={`icons/${iconName}.png`} title={tite} onClick={() => action()} />,
            type: 'button',
            variant: 'icon',
        };
        return  button;
      }
};
