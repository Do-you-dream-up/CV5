import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import { TabContext } from '../../contexts/TabContext';
import Configuration from '../../tools/configuration';


const TABS = Configuration.get('tabs');
const TABS_VALUES = Array.isArray(TABS.values) ? TABS.values : [TABS.values];


/**
 * Render clickable tabs to select the current tab content. The available tabs
 * are pulled from the configuration.
 */
class Tabs extends React.PureComponent {

  static contextType = TabContext;

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { select, state: tabState } = this.context;
    const { classes } = this.props;
    return (
      <div className={classNames('dydu-tabs', classes.root)}>
        {TABS_VALUES.map((it, index) => {
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
}


export default withStyles(styles)(Tabs);
