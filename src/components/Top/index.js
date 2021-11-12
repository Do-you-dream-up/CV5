import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { EventsContext } from '../../contexts/EventsContext';
import { UserActionContext } from '../../contexts/UserActionContext';
import dydu from '../../tools/dydu';
import { Local } from '../../tools/storage';
import PrettyHtml from '../PrettyHtml';
import useStyles from './styles';

/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top({ className, component, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('top');
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const { period, size } = configuration.top;
  const { tabbing } = useContext(UserActionContext) || false;
  const classes = useStyles();
  const teaserMode = Local.get(Local.names.open) === 1;

  const fetch = useCallback(
    () =>
      !teaserMode &&
      !!size &&
      dydu.top(period, size).then(({ knowledgeArticles }) => {
        try {
          const top = JSON.parse(knowledgeArticles);
          setItems(Array.isArray(top) ? top : [top]);
        } catch (e) {
          setItems([]);
        } finally {
          setReady(true);
        }
      }),
    [period, size, teaserMode],
  );

  const onAskHandler = (reword) => {
    event('topClicked', reword);
    window.dydu.chat.ask(reword, { type: 'redirection_knowledge' });
  };

  useEffect(() => {
    if (!ready) {
      fetch();
    }
  }, [fetch, ready]);

  useEffect(() => {
    if (items.length) event('topDisplay');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    !!items.length &&
    React.createElement(
      component,
      { className: c('dydu-top', className), ...rest },
      <PrettyHtml>
        <ol>
          {items.map(({ reword }, index) => {
            const onAsk = (event) => {
              onAskHandler(reword);
              event.stopPropagation();
            };
            return (
              <li key={index}>
                <a
                  href="#"
                  className={c('dydu-top-items', {
                    [classes.hideOutline]: !tabbing,
                  })}
                  children={reword}
                  onClick={onAsk}
                  tabIndex="0"
                />
              </li>
            );
          })}
        </ol>
      </PrettyHtml>,
    )
  );
}

Top.defaultProps = {
  component: 'div',
};

Top.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
};
