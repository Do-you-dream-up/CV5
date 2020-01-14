import c from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import dydu from '../../tools/dydu';
import Interaction from '../Interaction';
import useStyles from './styles';


/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ items, setItems ] = useState([]);
  const [ ready, setReady ] = useState(false);
  const { t } = useTranslation('top');
  const { size } = configuration.top;
  const html = !!items.length && [
    t('text'),
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
    <article className={c('dydu-top', classes.root)}>
      <Interaction live text={html} type="response" />
    </article>
  );
}
