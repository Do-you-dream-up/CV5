import Actions from '../Actions/Actions';
import { useUserConsent } from '../../contexts/UserConsentContext';
import c from 'classnames';
import useStyles from './styles';
import UserConsentOptions from '../UserConsentOptions/UserConsentOptions';
import { useBotInfo } from '../../contexts/BotInfoContext';
import Loader from '../Loader';
import { Local } from 'src/tools/storage';
import Button from '../Button/Button';

/**
 * User Consent disclaimer. Ask the user at first visit what information he chooses to share.
 */
interface UserConsentDisclaimerProps {
  children?: any;
}

export default function UserConsentDisclaimer({ children, ...rest }: UserConsentDisclaimerProps) {
  const classes = useStyles();
  const {
    displayUserConsent,
    userConsentEnabled,
    userConsentPassed,
    userConsentForCurrentLanguage,
    onAccept,
    onDecline,
    onChooseOptions,
    displayUserConsentOptions,
  } = useUserConsent();
  const { isUserConsentFetched } = useBotInfo();

  const idLabel = 'dydu-userConsent-text';

  const horizontalActions = () => {
    return (
      <div className={classes.horizontalActions}>
        <Button className={classes.horizontalButton} id={'dydu-disclaimer-refuse'} onClick={onDecline} sidebar={true}>
          {userConsentForCurrentLanguage?.firstPage?.refuseAll}
        </Button>
        <Button
          className={classes.horizontalButton}
          id={'dydu-disclaimer-ok'}
          onClick={() => onAccept && onAccept(true)}
        >
          {userConsentForCurrentLanguage?.firstPage?.acceptAll}
        </Button>
        <Button className={classes.horizontalButton} id={'dydu-disclaimer-options'} onClick={onChooseOptions}>
          {userConsentForCurrentLanguage?.firstPage?.chooseOptions}
        </Button>
      </div>
    );
  };

  if (!isUserConsentFetched && userConsentEnabled && !Local.userConsentOptions.load()) {
    return <Loader variant="consent" size={9} />;
  }

  if (!userConsentEnabled || (userConsentPassed && !displayUserConsent)) {
    return children;
  } else if (((userConsentEnabled && !userConsentPassed) || displayUserConsent) && !displayUserConsentOptions) {
    return (
      <div {...rest} className={c('dydu-userConsent-disclaimer', classes.root)} id="dydu-user-consent-disclaimer">
        {
          <>
            <h2 className={c('dydu-userConsent-disclaimer-title', classes.title)} id={idLabel}>
              {userConsentForCurrentLanguage?.firstPage?.title}
            </h2>
            <div className={c('dydu-userConsent-disclaimer-body', classes.body)}>
              <p dangerouslySetInnerHTML={{ __html: userConsentForCurrentLanguage?.firstPage?.description }}></p>
            </div>
          </>
        }
        {horizontalActions()}
      </div>
    );
  } else if (userConsentEnabled && (!userConsentPassed || displayUserConsent) && displayUserConsentOptions) {
    return <UserConsentOptions></UserConsentOptions>;
  } else {
    return children;
  }
}
