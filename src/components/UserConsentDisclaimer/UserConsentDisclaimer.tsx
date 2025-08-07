import Actions from '../Actions/Actions';
import { useUserConsent } from '../../contexts/UserConsentContext';
import c from 'classnames';
import useStyles from './styles';
import UserConsentOptions from '../UserConsentOptions/UserConsentOptions';
import { useBotInfo } from '../../contexts/BotInfoContext';
import Loader from '../Loader';
import { Local } from 'src/tools/storage';

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
  const actions = [
    {
      children: userConsentForCurrentLanguage?.firstPage?.refuseAll,
      id: 'dydu-disclaimer-refuse',
      onClick: onDecline,
      sidebar: true,
    },
    {
      children: userConsentForCurrentLanguage?.firstPage?.acceptAll,
      onClick: () => onAccept && onAccept(true),
      id: 'dydu-disclaimer-ok',
    },
    {
      children: userConsentForCurrentLanguage?.firstPage?.chooseOptions,
      onClick: onChooseOptions,
      id: 'dydu-disclaimer-options',
    },
  ];

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
        <Actions
          actions={actions}
          className={c('dydu-userConsent-disclaimer-actions', classes.actions)}
          groupId={idLabel}
          role="group"
        />
      </div>
    );
  } else if (userConsentEnabled && (!userConsentPassed || displayUserConsent) && displayUserConsentOptions) {
    return <UserConsentOptions></UserConsentOptions>;
  } else {
    return children;
  }
}
