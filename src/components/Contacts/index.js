import ContactsList from '../ContactsList';
import Paper from '../Paper/index';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Contact tab
 */
export default function Contacts() {
  const { configuration } = useConfiguration();
  const showPhone = configuration.contacts.phone;
  const showEmail = configuration.contacts.email;
  const showSocial = configuration.contacts.socialNetwork;
  const classes = useStyles();
  const { ready, t } = useTranslation('translation');
  const phoneTitle = t('contacts.phone.title');
  const phones = t('contacts.phone.list');
  const emailTitle = t('contacts.email.title');
  const emails = t('contacts.email.list');
  const socialTitle = t('contacts.socialNetwork.title');
  const socialNetworks = t('contacts.socialNetwork.list');

  return (
    !!ready && (
      <div className={classes.root} id="dydu-contact-wrapper">
        <Paper elevation={4}>
          {showPhone && <ContactsList id="phone" title={phoneTitle} list={phones} icon="icons/dydu-phone-black.svg" />}
          {showEmail && <ContactsList id="email" title={emailTitle} list={emails} icon="icons/dydu-email-black.svg" />}
          {showSocial && (
            <ContactsList id="social" title={socialTitle} list={socialNetworks} icon="icons/dydu-account-black.svg" />
          )}
        </Paper>
      </div>
    )
  );
}
