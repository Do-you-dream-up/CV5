import { useShadow } from '../../contexts/ShadowProvider';
import Button from '../Button/Button';
import useStyles from './styles';
import icons from '../../tools/icon-constants';
import Icon from '../Icon/Icon';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useTranslation } from 'react-i18next';

const ScrollToBottom = () => {
  const { t } = useTranslation();
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration });
  const { shadowAnchor } = useShadow();

  const chatboxDiv = shadowAnchor?.querySelector('.dydu-chatbox-body');

  return (
    <>
      <Button
        className={[classes.base]}
        onClick={() => {
          setTimeout(() => {
            if (chatboxDiv) {
              chatboxDiv.scrollTop = chatboxDiv.scrollHeight;
            }
          }, 0);
        }}
      >
        <Icon className={'dydu-icon-scroll-to-bottom'} icon={icons.caretDown} alt={t('general.scrollToBottom')} />
      </Button>
    </>
  );
};

export default ScrollToBottom;
