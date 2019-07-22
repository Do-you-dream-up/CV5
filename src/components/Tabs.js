import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import { TabContext } from '../contexts/TabContext';
import Configuration from '../tools/configuration';


const styles = theme => ({
  disabled: {
    cursor: 'not-allowed',
    opacity: .5,
  },
  enabled: {
    cursor: 'pointer',
    '&:hover': {backgroundColor: theme.palette.action.hover},
  },
  root: {
    background: theme.palette.primary.dark,
    display: 'flex',
    '&&': Configuration.getStyles('tabs'),
  },
  selected: {
    '&::after': {
      backgroundColor: theme.palette.secondary.main,
      bottom: 0,
      content: '""',
      display: 'block',
      height: 2,
      left: 0,
      position: 'absolute',
      right: 0,
    },
  },
  tab: {
    alignItems: 'center',
    color: theme.palette.primary.text,
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    justifyContent: 'center',
    padding: '.5em',
    position: 'relative',
  },
});


const TABS = Configuration.get('tabs');
const TABS_VALUES = Array.isArray(TABS.values) ? TABS.values : [TABS.values];


class Tabs extends React.PureComponent {

  static contextType = TabContext;

  static propTypes = {
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
