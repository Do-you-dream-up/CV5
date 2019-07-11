import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from './Button';
import Configuration from '../tools/configuration';


const styles = theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-between',
    padding: '.5em',
    position: 'relative',
    '&&': Configuration.getStyles('header'),
  },
  title: {
    padding: '.5em',
  },
});


class Header extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const { classes, toggle } = this.props;
    return (
      <div className={classNames('dydu-header', classes.root)}>
        <div className={classNames('dydu-header-title', classes.title)}>Header</div>
        <div className={classNames('dydu-header-actions', classes.actions)}>
          <Button onClick={toggle()} variant="icon">
            <img alt="Close" src="icons/close.png" title="Close" />
          </Button>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Header);
