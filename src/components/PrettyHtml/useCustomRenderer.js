import React, { useContext } from 'react';

import { DialogContext } from '../../contexts/DialogContext';

export default function useCustomRenderer() {
  const { setZoomSrc } = useContext(DialogContext);

  return {
    replace: (props) => {
      // const filter = getFilters({ setZoomSrc }).find((filter) => filter.test(props)); // TODO : Corriger le case du zoom
      getFilters({ setZoomSrc }).forEach((filter) => {
        const { test, process } = filter;
        return test(props) && process(props);
      });
    },
  };
}

const getFilters = (utils) => [
  {
    test: ({ name }) => name === 'a',
    process: (props) => {
      props.attribs = { ...props.attribs, onClick: new Function(`${props.attribs.onclick}`) };
      delete props.attribs.onclick;
      return <a {...props.attribs}>{props.children}</a>;
    },
  },
  {
    test: ({ name }) => name === 'img',
    process: (props) => {
      const { attribs } = props;
      return (
        <div onClick={() => utils.setZoomSrc(attribs?.src)}>
          <img src={attribs?.src} />
        </div>
      );
    },
  },
];
