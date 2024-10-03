import Button from '../Button/Button';
import PropTypes from 'prop-types';
import c from 'classnames';
import { createElement } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { Local } from '../../tools/storage';
import { useLivechat } from '../../contexts/LivechatContext';

/**
 * Confirmation modal to close the chatbox.
 */
export default function ModalClose({ className, component, onReject, onResolve, ...rest }) {
  const { send } = useLivechat();
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const body = t('close.body', { defaultValue: '' });
  const no = t('close.no');
  const title = t('close.title', { defaultValue: '' });
  const liveChatEnd = "Si vous fermez la fenêtre, vous ne pourrez plus reprendre la conversation avec l'opérateur.";
  const yes = t('close.yes');
  const isLiveChatOn = Local.isLivechatOn.load();
  const onClick = () => {
    if (isLiveChatOn) {
      send && send('#livechatend#', { hide: true });
      onResolve();
    } else {
      onResolve();
    }
  };

  return createElement(
    component,
    { className: c('dydu-close', className), ...rest },
    <>
      {title && <h3 children={title} className={classes.title} />}
      {body && <p children={body} className={classes.body} />}
      {isLiveChatOn && liveChatEnd && <p children={liveChatEnd} className={classes.liveChatEnd} />}
      <div children={title} className={classes.actions} data-testid="modal-close">
        {typeof onReject === 'function' && <Button children={no} onClick={onReject} sidebar={true} />}
        <Button children={yes} onClick={onClick} />
      </div>
    </>,
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
