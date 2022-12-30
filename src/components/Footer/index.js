import React, { useEffect, useState } from 'react';

import Actions from '../Actions';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import Input from '../Input';
import PropTypes from 'prop-types';
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
  const { configuration } = useConfiguration();
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

  return (
    <>
      <footer className={c('dydu-footer', classes.root)} {...rest} id="dydu-footer">
        <Actions actions={actions} className={c('dydu-footer-actions', classes.actions)} id="dydu-language-selector" />
        <div className={classes.content}>
          <Input focus={focus} onRequest={onRequest} onResponse={onResponse} id="dydu-footer-input" />
        </div>
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
