import { createElement, MutableRefObject, useEffect, useRef } from 'react';

import Button from '../Button/Button';
import MenuList from '../MenuList/MenuList';
import PropTypes from 'prop-types';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUserAction } from '../../contexts/UserActionContext';
import { useDialog } from '../../contexts/DialogContext';
import { DatabaseIcon, EmailIcon, PrinterIcon, ShieldIcon } from '../CustomIcons/CustomIcons';
import { useShadow } from '../../contexts/ShadowProvider';

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
  const sendGdprData: undefined | boolean = configuration?.moreOptions?.sendGdprData;
  const _printConversation: undefined | boolean = configuration?.moreOptions?.printConversation;
  const exportConversation: undefined | boolean = configuration?.moreOptions?.exportConversation;
  const { interactions } = useDialog();
  const { focusTrap, eventFired } = useUserAction();
  const root: MutableRefObject<any> = useRef(null);
  const { shadowRoot } = useShadow();

  useEffect(() => {
    focusTrap && focusTrap(eventFired, root, shadowRoot, 'button, img, a');
  }, [eventFired]);

  const items = [
    {
      icon: <PrinterIcon />,
      onClick: interactions?.length > 1 ? () => dydu.printHistory() : null,
      text: print,
      when: !!_printConversation,
    },
    {
      icon: <EmailIcon />,
      onClick: () => window.dydu.promptEmail.prompt('exportConv'),
      text: email,
      when: !!exportConversation,
    },
    {
      icon: <DatabaseIcon />,
      onClick: () => window.dydu.space.prompt(),
      text: [spaces, dydu.getSpace()].filter((it) => it).join(': '),
      when: configuration?.spaces?.items?.length && configuration?.spaces?.items?.length > 1,
    },
    {
      icon: <ShieldIcon />,
      onClick: () => window.dydu.promptEmail.prompt('gdpr'),
      text: gdpr,
      when: !!sendGdprData,
    },
  ];

  return createElement(
    component,
    {
      className: c('dydu-footer-menu', className, classes.root),
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': title,
      ...rest,
    },
    <div ref={root}>
      {title && <h2 children={title} className={classes.title} id={title} />}
      <MenuList
        items={items}
        onClose={() => {
          onResolve();
        }}
      />
      <div className={classes.actions}>
        <Button
          children={close}
          grow
          onClick={() => {
            getRgaaRef && getRgaaRef('moreOptionsRef').current?.focus();
            onResolve();
          }}
        />
      </div>
    </div>,
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
