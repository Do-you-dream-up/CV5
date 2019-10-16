import classNames from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import useStyles from './styles';
import Interaction from '../Interaction';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import dydu from '../../tools/dydu';


/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ items, setItems ] = useState([]);
  const [ ready, setReady ] = useState(false);
  const { size, text } = configuration.top;
  const html = !!items.length && [
    text,
    '<ol>',
    items.map(({ reword }) => {
      const ask = `window.dydu.chat.ask('${reword}')`;
      return `<li><span class="dydu-link" onclick="${ask}">${reword}</span></li>`;
    }).join(''),
    '</ol>',
  ].join('');

  const fetch = useCallback(() => !!size && dydu.top(size).then(({ knowledgeArticles }) => {
    try {
      const top = JSON.parse(knowledgeArticles);
      setItems(Array.isArray(top) ? top : [top]);
    }
    catch (e) {
      setItems([]);
    }
    finally {
      setReady(true);
    }
  }), [size]);

  useEffect(() => {
    if (!ready) {
      fetch();
    }
  }, [fetch, ready]);

  return html && (
    <article className={classNames('dydu-top', classes.root)}>
      <Interaction live text={html} type="response" />
    </article>
  );
}
