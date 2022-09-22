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
      props.attribs.onclick = replaceExternalSingleQuotesByDoubleQuotes(props.attribs.onclick);
      props.attribs = { ...props.attribs, onClick: new Function(`${props.attribs.onclick}`) };
      delete props.attribs.onclick;
      return <a {...props.attribsk}>{props.children}</a>;
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

const replaceExternalSingleQuotesByDoubleQuotes = (s) => {
  const startPos = s?.indexOf("'") + 1;
  const endPos = s?.lastIndexOf("'");
  const string = s?.substring(startPos, endPos);
  const final = `"${string}"`;
  return s?.replace(/'.*'/, final);
};
