import { isDefined, isOfTypeObject, sortQuickReply } from '../../tools/helpers';

import PropTypes from 'prop-types';
import c from 'classnames';
import { useMemo } from 'react';
import useStyles from './styles';
import Html2ReactParser from '../../html-to-react/lib/parser';

export default function QuickreplyTemplate({ html }) {
  const classes = useStyles();

  const content = useMemo(() => {
    if (!isDefined(html)) return null;
    let parse = null;
    try {
      parse = JSON.parse(html);
    } catch {
      parse = html;
    }
    if (!isDefined(parse) || !isOfTypeObject(parse)) return null;
    return parse;
  }, [html]);

  const text = useMemo(() => {
    if (!isDefined(content)) return null;
    return content.text;
  }, [content]);

  const sortQuick = useMemo(() => {
    if (!isDefined(content)) return null;
    else {
      return sortQuickReply(content.quick);
    }
  });

  const hasQuickButton = () => {
    return sortQuick && Object.keys(sortQuick).some((key) => sortQuick[key]);
  };

  if (!isDefined(content)) return null;

  if (sortQuick !== null) {
    for (const key in sortQuick) {
      sortQuick[key] = new Html2ReactParser().parse(sortQuick[key]);
    }
  }

  return (
    <div className={c('dydu-quickreply-template', classes.quick)}>
      {!!text && (
        <p
          className={c('dydu-quickreply-template-content', classes.text, {
            [classes.separator]: hasQuickButton(),
          })}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {sortQuick &&
        Object.keys(sortQuick)
          .sort((a, b) => a - b)
          .map((el) => {
            return <p className={c('dydu-quickreply-template-buttons', classes.buttons)}>{sortQuick[el]}</p>;
          })}
    </div>
  );
}

QuickreplyTemplate.propTypes = {
  html: PropTypes.string,
};
