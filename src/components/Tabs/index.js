import c from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { TabContext } from '../../contexts/TabContext';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * Render clickable tabs to select the current tab content. The available tabs
 * are pulled from the configuration.
 */
export default function Tabs() {

  const { configuration } = useContext(ConfigurationContext);
  const { current, select, tabs = [] } = useContext(TabContext) || {};
  const classes = useStyles({configuration, current, length: tabs.length});
  const { ready, t } = useTranslation('tabs');
  const { title: hasTitle } = configuration.tabs;

  return !!tabs.length && (
    <div className={c('dydu-tabs', classes.root)}>
      <div className={classes.indicator} />
      {tabs.map(({ icon, key }, index) => {
        const label = t(key);
        return (
          <div className={c('dydu-tab', classes.tab)} key={index} onClick={select(key)} title={label}>
            <div className={c('dydu-tab-label', classes.label, {[classes.selected]: current === index})}>
              {!!icon && <img alt={label} className={classes.icon} src={icon} />}
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
  );
}
