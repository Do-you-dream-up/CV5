import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';
import Banner from '../Banner';
import Button from '../Button';
import Menu from '../Menu';
import Onboarding from '../Onboarding';
import Tabs from '../Tabs';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonContext } from '../../contexts/DragonContext';
import { ACTIONS } from '../../tools/talk';


/**
 * Header of the chatbox. Typically placed on top and hold actions such as
 * closing the chatbox or changing the current language.
 */
export default function Header({ onClose, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { onDragStart } = useContext(DragonContext);
  const dragonZone = useRef();
  const classes = useStyles({configuration});
  const [ t, i ] = useTranslation('header');
  const { languages=[] } = configuration.application;
  const { title: hasTitle } = configuration.header;
  const actionClose = t('actions.close');
  const actionGdpr = t('actions.gdpr');
  const actionMore = t('actions.more');
  const actionRosetta = t('actions.rosetta');

  const gdprMenu = [[
    {onClick: () => window.dydu.gdpr.get(), text: t('gdpr.get')},
    {onClick: () => window.dydu.gdpr.forget(), text: t('gdpr.forget')},
  ]];
  const languagesMenu = [languages.sort().map(id => ({
    id,
    onClick: () => window.dydu.localization.set(id),
    text: t(`rosetta.${id}`),
  }))];
  const moreMenu = [Object.keys(ACTIONS).map(it => ({
    onClick: ACTIONS[it] && (() => window.dydu.chat.ask(it, {hide: true})),
    text: it,
  }))];

  return (
    <header className={c('dydu-header', classes.root)} {...rest}>
      <div className={c('dydu-header-body', classes.body, {[classes.draggable]: onDragStart})}
           onMouseDown={onDragStart && onDragStart(dragonZone)}
           ref={dragonZone}>
        {!!hasTitle && <div children={t('title')} className={c('dydu-header-title', classes.title)} />}
        <div className={c('dydu-header-actions', classes.actions)}>
          {languagesMenu.flat().length > 1 && (
            <Menu items={languagesMenu} selected={i.languages[0]}>
              <Button variant="icon">
                <img alt={actionRosetta} src="icons/flag.png" title={actionRosetta} />
              </Button>
            </Menu>
          )}
          <Onboarding>
            <Menu items={gdprMenu}>
              <Button variant="icon">
                <img alt={actionGdpr} src="icons/shield-lock.png" title={actionGdpr} />
              </Button>
            </Menu>
            {!!moreMenu.flat().length && (
              <Menu items={moreMenu}>
                <Button variant="icon">
                  <img alt={actionMore} src="icons/dots-vertical.png" title={actionMore} />
                </Button>
              </Menu>
            )}
          </Onboarding>
          <Button onClick={onClose} variant="icon">
            <img alt={actionClose} src="icons/close.png" title={actionClose} />
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
  onClose: PropTypes.func.isRequired,
  style: PropTypes.object,
};
