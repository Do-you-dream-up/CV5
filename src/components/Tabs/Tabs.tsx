import { useContext, useEffect } from 'react';

import { EventsContext } from '../../contexts/EventsContext';
import Icon from '../Icon/Icon';
import Skeleton from '../Skeleton';
import { TabContext } from '../../contexts/TabContext';
import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

/**
 * Render clickable tabs to select the current tab content. The available tabs
 * are pulled from the configuration.
 */
export default function Tabs() {
  const { configuration } = useConfiguration();
  const event = useContext?.(EventsContext)?.onEvent?.('tab');
  const { current, select, tabs = [] } = useContext(TabContext) || {};
  const classes = useStyles({ configuration, current, length: tabs.length });
  const { ready, t } = useTranslation('translation');
  const { title: hasTitle } = configuration?.tabs || {};
  const { tabbing } = useContext(UserActionContext) || false;
  const activeTab = t('tabs.activeTab');
  const theme = useTheme<any>();

  useEffect(() => {
    if (current === 1) event && event('contactDisplay');
  }, [current, event]);

  return (
    !!tabs.length && (
      <div className={c('dydu-tabs', classes.root)} id="dydu-tabs">
        <div className={classes.indicator} />
        {tabs.map(({ icon, key }, index) => {
          const label = current === index ? t(`tabs.${key}`) + activeTab : t(`tabs.${key}`);

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
              tabIndex={0}
              onKeyDown={onKeyDown}
              role="navigation"
              id="dydu-tab"
            >
              <div
                className={c('dydu-tab-label', classes.label, {
                  [classes.selected]: current === index,
                })}
              >
                {!!icon && (
                  <Icon icon={icon} color={theme?.palette?.primary.text || ''} className={classes.icon} alt={label} />
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
