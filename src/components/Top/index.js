import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import dydu from '../../tools/dydu';


/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top({ className, component, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const [ items, setItems ] = useState([]);
  const [ ready, setReady ] = useState(false);
  const { size } = configuration.top;

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

  return !!items.length && (
    React.createElement(component, {className: c('dydu-top', className), ...rest}, (
      <ol>
        {items.map(({ reword }, index) => {
          const onAsk = () => window.dydu.chat.ask(reword);
          return <li key={index}><span children={reword} className="dydu-link" onClick={onAsk} /></li>;
        })}
      </ol>
    ))
  );
}


Top.defaultProps = {
  component: 'div',
};


Top.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
};
