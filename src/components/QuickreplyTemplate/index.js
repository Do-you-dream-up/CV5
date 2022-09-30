// import c from 'classnames';

import PropTypes from 'prop-types';
import React from 'react';
import UploadFileTemplate from '../UploadFileTemplate';

// import useStyles from './styles';
// import { isDefined, isOfTypeObject } from '../../tools/helpers';

export default function QuickreplyTemplate() {
  // const classes = useStyles();

  // const content = useMemo(() => {
  //   if (!isDefined(html)) return null;
  //   let parse = null;
  //   try {
  //     parse = JSON.parse(html);
  //   } catch {
  //     parse = html;
  //   }
  //   if (!isDefined(parse) || !isOfTypeObject(parse)) return null;
  //   return parse;
  // }, [html]);

  // const text = useMemo(() => {
  //   if (!isDefined(content)) return null;
  //   return content.text;
  // }, [content]);

  // const quick = useMemo(() => {
  //   if (!isDefined(content)) return null;
  //   return content.quick || {};
  // }, [content]);

  // const separator = useMemo(() => {
  //   if (!isDefined(content)) return null;
  //   return content.separator;
  // }, [content]);

  // if (!isDefined(content)) return null;
  return (
    // <div className={c('dydu-quickreply-template', classes.quick)}>
    //   {!!text && (
    //     <div
    //       className={c('dydu-quickreply-template-content', classes.text)}
    //       dangerouslySetInnerHTML={{ __html: text }}
    //     />
    //   )}
    //   {separator && <div className={c('dydu-quickreply-template-separator', classes.separator)} />}
    //   {Object.keys(quick)
    //     .sort()
    //     .map((el, index) => {
    //       return (
    //         quick[el] && (
    //           <div
    //             className={c('dydu-quickreply-template-buttons', classes.buttons)}
    //             key={index}
    //             dangerouslySetInnerHTML={{ __html: quick[el] }}
    //           />
    //         )
    //       );
    //     })}
    // </div>
    <div>
      <p>Merci de choisir le fichier à envoyer</p>
      <UploadFileTemplate />
    </div>
  );
}

QuickreplyTemplate.propTypes = {
  html: PropTypes.string,
};
