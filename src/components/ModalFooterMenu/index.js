import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dydu from '../../tools/dydu';
import Button from '../Button';
import MenuList from '../MenuList';
import useStyles from './styles';


/**
 * Footer menu. Display a list of hidden features.
 */
export default function ModalFooterMenu({ className, component, onReject, onResolve, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('footer');
  const close = t('menu.close');
  const email = t('menu.email');
  const gdpr = t('menu.gdpr');
  const title = t('menu.title', {defaultValue: ''});
  const spaces = t('menu.spaces');

  const items = [
    {icon: 'icons/email-send.black.png', onClick: null, text: email},
    {
      icon: 'icons/database.black.png',
      onClick: () => window.dydu.space.prompt(),
      text: [spaces, dydu.getSpace()].filter(it => it).join(': '),
    },
    {icon: 'icons/shield-lock.black.png', onClick: () => window.dydu.gdpr.prompt(), text: gdpr},
  ];

  return React.createElement(
    component,
    {className: c('dydu-footer-menu', className, classes.root), ...rest},
    (
      <>
        {title && <div children={title} className={classes.title} />}
        <MenuList items={items} onClose={onResolve} />
        <div children={title} className={classes.actions}>
          <Button children={close} grow onClick={onResolve} />
        </div>
      </>
    ),
  );
}


ModalFooterMenu.defaultProps = {
  component: 'div',
};


ModalFooterMenu.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
};
