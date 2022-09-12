import React, { useContext } from 'react';

import { DialogContext } from '../../contexts/DialogContext';

export default function useCustomRenderer() {
  const { setZoomSrc } = useContext(DialogContext);

  return {
    replace: (props) => {
      getFilters({ setZoomSrc }).forEach((filter) => {
        const { test, process } = filter;
        return test(props) && process(props);
      });
    },
  };
}

const getFilters = (utils) => [
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
  {
    test: ({ name }) => name === 'a',
    process: (props) => {
      // reword('coucou c'est par ici', {...}) => reword("coucou c'est par ici", {..});
      //        ^--------------------^                   ^--------------------^
      props.attribs.onclick = replaceExternalSingleQuotesByDoubleQuotes(props.attribs.onclick);
      props.attribs = { ...props.attribs, onClick: new Function(`${props.attribs.onclick}`) };
      delete props.attribs.onclick;
      return <a {...props.attribsk}>{props.children}</a>;
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
