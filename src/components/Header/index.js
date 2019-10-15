import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import Banner from '../Banner';
import Button from '../Button';
import Menu from '../Menu';
import Onboarding from '../Onboarding';
import Tabs from '../Tabs';
import { DragonContext } from '../../contexts/DragonContext';
import { withConfiguration } from '../../tools/configuration';
import { ACTIONS } from '../../tools/talk';


/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
function Header({ configuration, onClose, style, ...rest }) {

  const { onDragStart } = useContext(DragonContext);
  const classes = useStyles({configuration});
  const { title='' } = configuration.header;
  const gdprMenu = [[
    {onClick: () => window.dydu.gdpr.get(), text: 'Get'},
    {onClick: () => window.dydu.gdpr.forget(), text: 'Forget'},
  ]];
  const languagesMenu = [[
    {onClick: () => window.dydu.localization.set('en'), text: 'English'},
    {onClick: () => window.dydu.localization.set('es'), text: 'Español'},
    {onClick: () => window.dydu.localization.set('fr'), text: 'Français'},
  ]];
  const moreMenu = [Object.keys(ACTIONS).map(it => ({
    onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
    text: it,
  }))];

  const properties = onDragStart ? {
    onMouseDown: onDragStart,
    style: {...style, cursor: 'move'},
  } : style;

  return (
    <header className={classNames('dydu-header', classes.root)} {...properties} {...rest}>
      <div className={classNames('dydu-header-body', classes.body)}>
        {title.length && (
          <div children={title} className={classNames('dydu-header-title', classes.title)} />
        )}
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
            <Menu items={moreMenu}>
              <Button variant="icon">
                <img alt="More" src="icons/dots-vertical.png" title="More" />
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

Header.propTypes = {
  configuration: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
};


export default withConfiguration(Header);
