import { isDefined, isOfTypeObject } from '../../tools/helpers';

import PropTypes from 'prop-types';
import c from 'classnames';
import { useMemo, useCallback } from 'react';
import useStyles from './styles';

export default function QuickreplyTemplate({ html }) {
  const classes = useStyles();

  const handleKeyDown = useCallback((event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const linkElement = event.currentTarget.querySelector('a');
      if (linkElement) {
        linkElement.click();
      }
    }
  }, []);

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

  const quick = useMemo(() => {
    if (!isDefined(content)) return null;
    return content.quick || {};
  }, [content]);

  const hasQuickButton = (quick) => {
    return Object.keys(quick).some((key) => quick[key]);
  };

  if (!isDefined(content)) return null;
  return (
    <div className={c('dydu-quickreply-template', classes.quick)}>
      {!!text && (
        <p
          className={c('dydu-quickreply-template-content', classes.text, {
            [classes.separator]: hasQuickButton(quick),
          })}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {Object.keys(quick)
        .sort()
        .map((el, index) => {
          return (
            quick[el] && (
              <p
                className={c('dydu-quickreply-template-buttons', classes.buttons)}
                key={index}
                dangerouslySetInnerHTML={{ __html: quick[el] }}
                onKeyDown={handleKeyDown}
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
