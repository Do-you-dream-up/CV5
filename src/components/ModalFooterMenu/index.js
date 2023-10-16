import { createElement, useContext, useEffect, useRef } from 'react';

import Button from '../Button/Button';
import { DialogContext } from '../../contexts/DialogContext';
import MenuList from '../MenuList/MenuList';
import PropTypes from 'prop-types';
import c from 'classnames';
import dydu from '../../tools/dydu';
import icons from '../../tools/icon-constants';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUserAction } from '../../contexts/UserActionContext';

/**
 * Footer menu. Display a list of hidden features.
 */
export default function ModalFooterMenu({ className, component, onResolve, ...rest }) {
  const { configuration } = useConfiguration();
  const { getRgaaRef } = useUserAction();
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const close = t('footer.menu.close');
  const print = t('footer.menu.print');
  const email = t('footer.menu.email');
  const gdpr = t('footer.menu.gdpr');
  const title = t('footer.menu.title', { defaultValue: '' });
  const spaces = t('footer.menu.spaces');
  const { exportConversation, printConversation: _printConversation, sendGdprData } = configuration.moreOptions;
  const { interactions } = useContext(DialogContext);
  const titleRef = useRef(null);

  const items = [
    {
      icon: icons?.printer,
      onClick: interactions?.length > 1 ? () => dydu.printHistory() : null,
      text: print,
      when: !!_printConversation,
    },
    {
      icon: icons?.email,
      onClick: () => window.dydu.promptEmail.prompt('exportConv'),
      text: email,
      when: !!exportConversation,
    },
    {
      icon: icons?.database,
      onClick: () => window.dydu.space.prompt(),
      text: [spaces, dydu.getSpace()].filter((it) => it).join(': '),
      when: configuration?.spaces?.items?.length > 1,
    },
    {
      icon: icons?.shield,
      onClick: () => window.dydu.promptEmail.prompt('gdpr'),
      text: gdpr,
      when: !!sendGdprData,
    },
  ];

  useEffect(() => {
    if (titleRef) {
      titleRef.current?.focus();
    }
  }, []);

  return createElement(
    component,
    { className: c('dydu-footer-menu', className, classes.root), ...rest },
    <>
      {title && <h2 ref={titleRef} children={title} className={classes.title} tabIndex={0} />}
      <MenuList
        items={items}
        onClose={() => {
          onResolve();
        }}
      />
      <div children={title} className={classes.actions}>
        <Button
          tabIndex={0}
          children={close}
          grow
          onClick={() => {
            getRgaaRef && getRgaaRef('moreOptionsRef').current?.focus();
            onResolve();
          }}
        />
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
