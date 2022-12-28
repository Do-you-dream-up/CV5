import React, { useContext, useEffect } from 'react';

import { EventsContext } from '../../contexts/EventsContext';
import PrettyHtml from '../PrettyHtml';
import PropTypes from 'prop-types';
import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { isEmptyArray } from '../../tools/helpers';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';

/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default function Top({ className, component, ...rest }) {
  const { topList: items = [] } = useDialog();
  const event = useContext(EventsContext).onEvent('top');
  const { tabbing } = useContext(UserActionContext) || false;
  const classes = useStyles();

  const onAskHandler = (reword) => {
    event('topClicked', reword);
    window.dydu.chat.ask(reword, { type: 'redirection_knowledge' });
  };

  useEffect(() => {
    if (items?.length) event('topDisplay');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items?.length]);

  return (
    !isEmptyArray(items) &&
    React.createElement(
      component,
      { className: c('dydu-top', className), ...rest, id: 'dydu-top-knowledge' },
      <PrettyHtml>
        <ol>
          {items?.map((item, index) => {
            const onAsk = (event) => {
              item?.reword && onAskHandler(item?.reword);
              event.preventDefault();
            };
            return (
              item?.reword && (
                <li key={index}>
                  <a
                    href="#"
                    className={c('dydu-top-items', classes.accessibility, {
                      [classes.hideOutline]: !tabbing,
                    })}
                    children={item?.reword}
                    onClick={onAsk}
                    tabIndex="0"
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
