import classNames from 'classnames';
import React, { useContext } from 'react';
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
  const { items } = configuration.tabs;

  return (
    <div className={classNames('dydu-tabs', classes.root)}>
      {items.map((it, index) => {
        const onClick = it.value ? select(it.value) : null;
        const names = classNames(
          'dydu-tab',
          classes.tab,
          onClick ? classes.enabled : classes.disabled,
          {[classes.selected]: tabState.current === it.value},
        );
        return <div children={it.text} className={names} key={index} onClick={onClick} />;
      })}
    </div>
  );
}
