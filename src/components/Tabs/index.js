import c from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { TabContext } from '../../contexts/TabContext';


/**
 * Render clickable tabs to select the current tab content. The available tabs
 * are pulled from the configuration.
 */
export default function Tabs() {

  const { configuration } = useContext(ConfigurationContext);
  const { select, state: tabState } = useContext(TabContext);
  const classes = useStyles({configuration});
  const { t } = useTranslation('tabs');
  const { items=[] } = configuration.tabs;

  return !!items.length && (
    <div className={c('dydu-tabs', classes.root)}>
      {items.map((it, index) => {
        const onClick = it ? select(it) : null;
        const names = c(
          'dydu-tab',
          classes.tab,
          onClick ? classes.enabled : classes.disabled,
          {[classes.selected]: tabState.current === it},
        );
        return (
          <div children={t(`${it}.text`)}
               className={names}
               key={index}
               onClick={onClick}
               title={t(`${it}.title`)} />
        );
      })}
    </div>
  );
}
