import React, { useContext, useEffect, useState } from 'react';

import Actions from '../Actions';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import Input from '../Input';
import PropTypes from 'prop-types';
import UploadInput from '../UploadInput';
import c from 'classnames';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * The footer typically renders the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
export default function Footer({ focus, onRequest, onResponse, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const { isFileActive } = useContext(DialogContext);
  const classes = useStyles({ configuration });
  const [t, i] = useTranslation('translation');
  const [selectedLanguage, setSelectedLanguage] = useState(configuration.application.defaultLanguage[0]);
  const { languages } = configuration.application;
  const { translate: hasTranslate } = configuration.footer;
  const actionTranslate = t('footer.translate');

  useEffect(() => {
    if (i.languages) setSelectedLanguage(i.languages[0]);
  }, [i, t]);

  const languagesMenu = [
    languages.sort().map((id) => ({
      icon: `flags/${id}.png`,
      id,
      onClick: () => window.dydu && window.dydu.localization && window.dydu.localization.set(id, languages),
      text: t(`footer.rosetta.${id}`),
    })),
  ];

  const actions = [
    {
      children: (
        <img
          alt={actionTranslate}
          src={`${process.env.PUBLIC_URL}flags/${selectedLanguage}.png`}
          title={actionTranslate}
        />
      ),
      items: () => languagesMenu,
      selected: () => selectedLanguage,
      variant: 'icon',
      when: hasTranslate && languagesMenu.flat().length > 1,
    },
  ];

  const inputRender = () => {
    if (isFileActive) {
      return <UploadInput />;
    } else {
      return <Input focus={focus} onRequest={onRequest} onResponse={onResponse} />;
    }
  };
  return (
    <>
      <footer className={c('dydu-footer', classes.root)} {...rest}>
        {!isFileActive && <Actions actions={actions} className={c('dydu-footer-actions', classes.actions)} />}
        <div className={classes.content}>{inputRender()}</div>
      </footer>
    </>
  );
}

Footer.defaultProps = {
  focus: true,
};

Footer.propTypes = {
  focus: PropTypes.bool,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};
