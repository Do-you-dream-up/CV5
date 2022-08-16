import React, { useContext } from 'react';

import { DialogContext } from '../../contexts/DialogContext';

export default () => {
  const { setZoomSrc } = useContext(DialogContext);

  return {
    replace: (props) => {
      const { name, attribs } = props;
      if (name === 'img') {
        return (
          <div onClick={() => setZoomSrc(attribs?.src)}>
            <img src={attribs?.src} />
          </div>
        );
      }
    },
  };
};
