import c from 'classnames';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { EventsContext } from '../../contexts/EventsContext';
import { TabContext } from '../../contexts/TabContext';
import { UserActionContext } from '../../contexts/UserActionContext';
import Skeleton from '../Skeleton';
import useStyles from './styles';

/**
 * Render clickable tabs to select the current tab content. The available tabs
 * are pulled from the configuration.
 */
export default function Tabs() {
  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('tab');
  const { current, select, tabs = [] } = useContext(TabContext) || {};
  const classes = useStyles({ configuration, current, length: tabs.length });
  const { ready, t } = useTranslation('translation');
  const { title: hasTitle } = configuration.tabs;
  const { tabbing } = useContext(UserActionContext) || false;

  useEffect(() => {
    if (current === 1) event('contactDisplay');
  }, [current, event]);

  return (
    !!tabs.length && (
      <div className={c('dydu-tabs', classes.root)}>
        <div className={classes.indicator} />
        {tabs.map(({ icon, key }, index) => {
          const label = t(`tabs.${key}`);
          const onKeyDown = (event) => {
            if (event.keyCode === 32 || event.keyCode === 13) {
              event.preventDefault();
              select(key)();
            }
          };
          return (
            <div
              className={c('dydu-tab', classes.tab, {
                [classes.hideOutline]: !tabbing,
              })}
              key={index}
              onClick={select(key)}
              title={label}
              tabIndex="0"
              onKeyDown={onKeyDown}
              role="navigation"
            >
              <div
                className={c('dydu-tab-label', classes.label, {
                  [classes.selected]: current === index,
                })}
              >
                {!!icon && (
                  <img
                    alt={label}
                    className={classes.icon}
                    src={`${process.env.PUBLIC_URL}${icon}`}
                  />
                )}
                {!!hasTitle && (
                  <Skeleton hide={!ready} variant="text" width="4em">
                    <span children={label} />
                  </Skeleton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
}
