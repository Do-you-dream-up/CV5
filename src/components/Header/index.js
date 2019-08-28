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
export default withStyles(styles)(class Header extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {

    const { classes, onClose, ...rest } = this.props;

    const gdprMenu = [
      {onClick: () => window.dydu.gdpr.get(), text: 'Get'},
      {onClick: () => window.dydu.gdpr.forget(), text: 'Forget'},
    ];

    const languagesMenu = [
      {onClick: () => window.dydu.localization.set('en'), text: 'English'},
      {onClick: () => window.dydu.localization.set('es'), text: 'Español'},
      {onClick: () => window.dydu.localization.set('fr'), text: 'Français'},
    ];

    const settingsMenu = Object.keys(ACTIONS).map(it => ({
      onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
      text: it,
    }));

    return (
      <header className={classNames('dydu-header', classes.root)} {...rest}>
        <div className={classNames('dydu-header-body', classes.body)}>
          <div children={HEADER_TITLE} className={classNames('dydu-header-title', classes.title)} />
          <div className={classNames('dydu-header-actions', classes.actions)}>
            <Onboarding>
              <Menu items={languagesMenu}>
                <Button variant="icon">
                  <img alt="Languages" src="icons/flag.png" title="Languages" />
                </Button>
              </Menu>
              <Menu items={gdprMenu}>
                <Button variant="icon">
                  <img alt="GDPR" src="icons/shield-lock.png" title="GDPR" />
                </Button>
              </Menu>
              <Menu items={settingsMenu}>
                <Button variant="icon">
                  <img alt="Settings" src="icons/dots-vertical.png" title="Settings" />
                </Button>
              </Menu>
            </Onboarding>
            <Button onClick={onClose} variant="icon">
              <img alt="Close" src="icons/close.png" title="Close" />
            </Button>
          </div>
        </div>
        <Onboarding>
          <Tabs />
          <Banner />
        </Onboarding>
      </header>
    );
  }
});
