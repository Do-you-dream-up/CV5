import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Banner from '../Banner';
import Button from '../Button';
import Menu from '../Menu';
import Onboarding from '../Onboarding';
import Tabs from '../Tabs';
import Configuration from '../../tools/configuration';
import { ACTIONS } from '../../tools/talk';


const HEADER_TITLE = Configuration.get('header.title', null);


/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
class Header extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { classes, onClose, ...rest } = this.props;
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
                  <Button variant="icon">
                    <img alt="Settings" src="icons/dots-vertical.png" title="Settings" />
                  </Button>
                </Menu>
              </Onboarding>
            )}
            <Button onClick={onClose} variant="icon">
              <img alt="Close" src="icons/close.png" title="Close" />
            </Button>
          </div>
        </div>
        <Onboarding children={<><Tabs /><Banner /></>} />
      </header>
    );
  }
}


export default withStyles(styles)(Header);
