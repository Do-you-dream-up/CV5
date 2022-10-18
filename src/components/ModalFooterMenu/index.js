import React, { useContext } from 'react';

import Button from '../Button';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import MenuList from '../MenuList';
import PropTypes from 'prop-types';
import c from 'classnames';
import dydu from '../../tools/dydu';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Footer menu. Display a list of hidden features.
 */
export default function ModalFooterMenu({ className, component, onResolve, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const close = t('footer.menu.close');
  const print = t('footer.menu.print');
  const email = t('footer.menu.email');
  const gdpr = t('footer.menu.gdpr');
  const title = t('footer.menu.title', { defaultValue: '' });
  const spaces = t('footer.menu.spaces');
  const { active: spaceChangeActive, items: spacesArray } = configuration.spaces;
  const { exportConversation, printConversation: _printConversation, sendGdprData } = configuration.moreOptions;
  const { interactions } = useContext(DialogContext);

  const printConversation = () => {
    dydu.printHistory();
  };

  const items = [
    {
      icon: 'icons/dydu-printer-black.svg',
      onClick: interactions.length > 1 ? () => printConversation() : null,
      text: print,
      when: !!_printConversation,
    },
    {
      icon: 'icons/dydu-email-send-black.svg',
      onClick: () => window.dydu.promptEmail.prompt('exportConv'),
      text: email,
      when: !!exportConversation,
    },
    {
      icon: 'icons/dydu-database-black.svg',
      onClick: spaceChangeActive && spacesArray.length > 1 ? () => window.dydu.space.prompt() : null,
      text: [spaces, dydu.getSpace()].filter((it) => it).join(': '),
    },
    {
      icon: 'icons/dydu-shield-lock-black.svg',
      onClick: () => window.dydu.promptEmail.prompt('gdpr'),
      text: gdpr,
      when: !!sendGdprData,
    },
  ];

  return React.createElement(
    component,
    { className: c('dydu-footer-menu', className, classes.root), ...rest },
    <>
      {title && <div children={title} className={classes.title} />}
      <MenuList items={items} onClose={onResolve} />
      <div children={title} className={classes.actions}>
        <Button children={close} grow onClick={onResolve} />
      </div>
    </>,
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
