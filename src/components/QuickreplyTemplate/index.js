import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import useStyles from './styles';
import { isDefined, isOfTypeObject } from '../../tools/helpers';

export default function QuickreplyTemplate({ html }) {
  const classes = useStyles();

  const content = useMemo(() => {
    if (!isDefined(html)) return null;
    const parse = JSON.parse(html);
    if (!isDefined(parse) || !isOfTypeObject(parse)) return null;
    return parse;
  }, [html]);

  const text = useMemo(() => {
    if (!isDefined(content)) return null;
    return content.text;
  }, [content]);

  const quick = useMemo(() => {
    if (!isDefined(content)) return null;
    return content.quick;
  }, [content]);

  if (!isDefined(content)) return null;

  return (
    <div className={c('dydu-quickreply-template', classes.quick)}>
      {!!text && (
        <div
          className={c('dydu-quickreply-template-content', classes.text)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {Object.keys(quick)
        .sort()
        .map((el, index) => {
          return (
            quick[el] && (
              <div
                className={c('dydu-quickreply-template-buttons', classes.buttons)}
                key={index}
                dangerouslySetInnerHTML={{ __html: quick[el] }}
              />
            )
          );
        })}
    </div>
  );
}

QuickreplyTemplate.propTypes = {
  html: PropTypes.string,
};
