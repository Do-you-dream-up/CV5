import { createElement, useContext, useEffect } from 'react';

import PrettyHtml from '../PrettyHtml';
import PropTypes from 'prop-types';
import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useTopKnowledge } from '../../contexts/TopKnowledgeContext';

/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top({ className, component, ...rest }) {
  const { topKnowledge } = useTopKnowledge();
  const event = useEvent().onEvent('top');
  const { tabbing } = useContext(UserActionContext) || false;
  const classes = useStyles();

  const onAskHandler = (reword) => {
    event('topClicked', reword);
    window.dydu?.chat?.ask(reword, { type: 'redirection_knowledge' });
  };

  useEffect(() => {
    if (topKnowledge?.length > 0) event('topDisplay');
  }, [topKnowledge?.length]);

  return (
    topKnowledge?.length > 0 &&
    createElement(
      component,
      { className: c('dydu-top', className), ...rest, id: 'dydu-top-knowledge' },
      <PrettyHtml>
        <ol>
          {topKnowledge?.map((item, index) => {
            const onAsk = (event) => {
              item?.reword && onAskHandler(item?.reword);
              event.preventDefault();
            };
            return (
              item?.reword && (
                <li key={index}>
                  <button
                    href="#"
                    className={c('dydu-top-items', classes.accessibility, {
                      [classes.hideOutline]: !tabbing,
                    })}
                    children={item?.reword}
                    onClick={onAsk}
                    tabIndex="0"
                    data-testId="dyduTopItems"
                  />
                </li>
              )
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
