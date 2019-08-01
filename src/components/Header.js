import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from './Button';
import Menu from './Menu';
import Onboarding from './Onboarding';
import Tabs from './Tabs';
import Configuration from '../tools/configuration';
import { ACTIONS } from '../tools/talk';


const styles = theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 'auto',
    '& > *': {
      marginLeft: '.5em',
    }
  },
  body: {
    alignItems: 'center',
    display: 'flex',
    padding: '.5em',
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    flex: '0 0 auto',
    position: 'relative',
    '&&': Configuration.getStyles('header'),
    [theme.breakpoints.down('xs')]: {'&&': {borderRadius: 0}},
  },
  title: {
    padding: '.5em',
  },
});


const HEADER_TITLE = Configuration.get('header.title', null);


class Header extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  toggleMenu = event => (
    this.setState({menuAnchor: event.currentTarget})
  );

  render() {
    const { classes, toggle, ...rest } = this.props;
    const menu = Object.keys(ACTIONS).map(it => ({
      onClick: ACTIONS[it] && (() => window.dydu.ask(it, {hide: true})),
      text: it,
    }));
    return (
      <header className={classNames('dydu-header', classes.root)} {...rest}>
        <div className={classNames('dydu-header-body', classes.body)}>
          <div children={HEADER_TITLE} className={classNames('dydu-header-title', classes.title)} />
          <div className={classNames('dydu-header-actions', classes.actions)}>
            {menu.length > 0 && (
              <Onboarding>
                <Menu items={menu}>
                  <Button onClick={this.toggleMenu} variant="icon">
                    <img alt="Settings" src="icons/dots-vertical.png" title="Settings" />
                  </Button>
                </Menu>
              </Onboarding>
            )}
            <Button onClick={toggle()} variant="icon">
              <img alt="Close" src="icons/close.png" title="Close" />
            </Button>
          </div>
        </div>
        <Onboarding children={<Tabs />} />
      </header>
    );
  }
}


export default withStyles(styles)(Header);
