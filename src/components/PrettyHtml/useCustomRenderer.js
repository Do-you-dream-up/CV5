import React, { useContext } from 'react';

import { DialogContext } from '../../contexts/DialogContext';
import { isDefined } from '../../tools/helpers';

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
      if (isDefined(props?.attribs?.onclick)) {
        props.attribs.onClick = createFunctionWithString(props?.attribs?.onclick);
        delete props.attribs.onclick;
      }
      return <a {...props.attribs}>{props.children}</a>;
    },
  },
  {
    test: ({ name }) => name === 'img',
    process: (props) => {
      const { attribs } = props;
      attribs.onClick = function onClickImg() {
        utils.setZoomSrc(attribs?.src);
      };
      return props;
    },
  },
];

const createFunctionWithString = (bodyFuncString) => {
  try {
    try {
      return new Function(bodyFuncString);
    } catch (err) {
      const bodyString = replaceExternalSingleQuotesByDoubleQuotes(bodyFuncString);
      return new Function(bodyString);
    }
  } catch (e) {
    return bodyFuncString;
  }
};

const replaceExternalSingleQuotesByDoubleQuotes = (s) => {
  const startPos = s?.indexOf("'") + 1;
  const endPos = s?.lastIndexOf("'");
  const string = s?.substring(startPos, endPos);
  const final = `"${string}"`;
  return s?.replace(/'.*'/, final);
};
