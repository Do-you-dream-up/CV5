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

  const newObjectSort = (obj, fn) => {
    return (
      obj &&
      Object.keys(obj).reduce((acc, k) => {
        acc[fn(obj[k], k, obj)] = obj[k];
        return acc;
      }, {})
    );
  };

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
      return newObjectSort(content.quick, (val, key) => {
        return parseInt(key.match(/\d+/));
      });
    }
  });

  const hasQuickButton = (sortQuick) => {
    return sortQuick && Object.keys(sortQuick).some((key) => sortQuick[key]);
  };

  if (!isDefined(content)) return null;
  return (
    <div className={c('dydu-quickreply-template', classes.quick)}>
      {!!text && (
        <p
          className={c('dydu-quickreply-template-content', classes.text, {
            [classes.separator]: hasQuickButton(sortQuick),
          })}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {sortQuick &&
        Object.keys(sortQuick)
          .sort((a, b) => a - b)
          .map((el, index) => {
            return (
              sortQuick[el] && (
                <p
                  className={c('dydu-quickreply-template-buttons', classes.buttons)}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: sortQuick[el] }}
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
