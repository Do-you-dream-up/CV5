import ContactsList from '../ContactsList';
import Paper from '../Paper/index';
import icons from '../../tools/icon-constants';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Contact tab
 */
export default function Contacts() {
  const { configuration } = useConfiguration();

  const classes = useStyles();
  const { ready, t } = useTranslation('translation');

  const SocialArticle = useMemo(() => {
    const socialNetworkIcon = icons.socialNetworkIcon;
    const socialTitle = t('contacts.socialNetwork.title');
    const socialNetworks = t('contacts.socialNetwork.list');
    const showSocial = configuration?.contacts?.socialNetwork;
    return showSocial ? (
      <ContactsList id="social" title={socialTitle} list={socialNetworks} icon={socialNetworkIcon} />
    ) : null;
  }, [configuration]);

  const PhoneArticle = useMemo(() => {
    const phoneTitle = t('contacts.phone.title');
    const phoneIcon = icons.phoneIcon;
    const phones = t('contacts.phone.list');
    const showPhone = configuration?.contacts?.phone;
    return showPhone ? <ContactsList id="phone" title={phoneTitle} list={phones} icon={phoneIcon} /> : null;
  }, [configuration]);

  const EmailArticle = useMemo(() => {
    const emailIcon = icons.emailIcon;
    const emailTitle = t('contacts.email.title');
    const emails = t('contacts.email.list');
    const showEmail = configuration?.contacts?.email;
    return showEmail ? <ContactsList id="email" title={emailTitle} list={emails} icon={emailIcon} /> : null;
  }, [configuration]);

  return (
    !!ready && (
      <div className={classes.root} id="dydu-contact-wrapper">
        <Paper elevation={4}>
          {PhoneArticle}
          {EmailArticle}
          {SocialArticle}
        </Paper>
      </div>
    )
  );
}
