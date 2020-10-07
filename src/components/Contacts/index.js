import React from 'react';
import { useTranslation } from 'react-i18next';
import ContactsList from '../ContactsList';
import Paper from '../Paper/index';
import useStyles from './styles';


/**
 * Contact tab
 */
export default function Contacts() {
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
        <ContactsList id='phone' title={phoneTitle} list={phones} icon={'icons/phone.png'} />
        <ContactsList id='email' title={emailTitle} list={emails} icon={'icons/email.png'} />
        <ContactsList id='social' title={socialTitle} list={socialNetworks} icon={'icons/account.png'} />
      </Paper>
    </div>
  );
}
