import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import ContactsList from '../ContactsList';
import Paper from '../Paper/index';
import useStyles from './styles';


/**
 * Contact tab
 */
export default function Contacts() {
  const { configuration } = useContext(ConfigurationContext);
  const showPhone = configuration.contacts.phone;
  const showEmail = configuration.contacts.email;
  const showSocial = configuration.contacts.socialNetwork;
  const classes = useStyles();
  const { ready, t } = useTranslation('contacts');
  const phoneTitle = t('phone.title');
  const phones = t('phone.list');
  const emailTitle = t('email.title');
  const emails = t('email.list');
  const socialTitle = t('socialNetwork.title');
  const socialNetworks = t('socialNetwork.list');

  return !!ready && (
    <div className={classes.root}>
      <Paper elevation={4}>
        {showPhone && <ContactsList id='phone' title={phoneTitle} list={phones} icon={'icons/phone.png'} />}
        {showEmail && <ContactsList id='email' title={emailTitle} list={emails} icon={'icons/email.png'} />}
        {showSocial && <ContactsList id='social' title={socialTitle} list={socialNetworks} icon={'icons/account.png'} />}
      </Paper>
    </div>
  );
}
