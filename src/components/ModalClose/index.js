import Button from '../Button/Button';
import PropTypes from 'prop-types';
import c from 'classnames';
import { createElement, useEffect, useRef } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { Local } from '../../tools/storage';
import { useLivechat } from '../../contexts/LivechatContext';
import { useShadow } from '../../contexts/ShadowProvider';
import { useUserAction } from '../../contexts/UserActionContext';

/**
 * Confirmation modal to close the chatbox.
 */
export default function ModalClose({ className, component, onReject, onResolve, ...rest }) {
  const { send } = useLivechat();
  const { shadowRoot } = useShadow();
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const body = t('close.body', { defaultValue: '' });
  const no = t('close.no');
  const title = t('close.title', { defaultValue: '' });
  const liveChatEnd = t('close.livechatEnd');
  const yes = t('close.yes');
  const liveChatType = Local.livechatType.load();
  const { eventFired } = useUserAction();
  const modalRef = useRef(null);
  const onClickClose = () => {
    if (liveChatType) {
      send && send('#livechatend#', { hide: true });
      onResolve();
    } else {
      onResolve();
    }
  };

  const onClickCancel = () => {
    onReject();
    const closeButton = shadowRoot?.getElementById('dydu-close');
    if (closeButton) {
      closeButton.focus();
    }
  };

  // UseEffect to handle the tab key press event and keep focus on the modal. if you add a new button or element, you need to add it to the focusableElements array.
  // we use document.activeElement.shadowRoot.activeElement to get the active element inside the shadowRoot.
  useEffect(() => {
    const modalElement = modalRef.current;
    const focusableElements = modalElement ? modalElement.querySelectorAll('button, h3, p') : [];
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isActiveElementInModal = Array.from(focusableElements).some(
        (element) => element === shadowRoot?.activeElement,
      );

      if (!isActiveElementInModal && firstElement) {
        firstElement.focus();
      }
      if (eventFired?.key === 'Tab') {
        if (eventFired?.shiftKey && shadowRoot?.activeElement === firstElement) {
          eventFired?.preventDefault();
          lastElement.focus();
        } else if (!eventFired?.shiftKey && shadowRoot?.activeElement === lastElement) {
          eventFired?.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [eventFired]);

  return createElement(
    component,
    { className: c('dydu-close', className), ...rest },
    <div className={'modal-close'} ref={modalRef}>
      {title && <h3 children={title} className={classes.title} tabIndex={0} aria-label={title} />}
      {body && <p children={body} className={classes.body} tabIndex={0} aria-label={body} />}
      {liveChatType && liveChatEnd && (
        <p children={liveChatEnd} className={classes.liveChatEnd} tabIndex={0} aria-label={liveChatEnd} />
      )}
      <div children={title} className={classes.actions} data-testid="modal-close">
        {typeof onReject === 'function' && <Button children={no} onClick={onClickCancel} sidebar={true} />}
        <Button children={yes} onClick={onClickClose} />
      </div>
    </div>,
  );
}

ModalClose.defaultProps = {
  component: 'div',
};

ModalClose.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
};
