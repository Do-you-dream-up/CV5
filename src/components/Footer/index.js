import { useCallback, useEffect, useState } from 'react';

import Actions from '../Actions/Actions';
import Input from '../Input';
import PropTypes from 'prop-types';
import UploadInput from '../UploadInput';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';

/**
 * The footer typically renders the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
export default function Footer({ focus, onRequest, onResponse, ...rest }) {
  const { showConfirmSelectedFile } = useUploadFile();
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

  const renderInput = useCallback(() => {
    console.log(showConfirmSelectedFile);
    return showConfirmSelectedFile ? (
      <UploadInput />
    ) : (
      <div className={classes.content}>
        <Input focus={focus} onRequest={onRequest} onResponse={onResponse} />
      </div>
    );
  }, [showConfirmSelectedFile]);

  return (
    <>
      <div className={c('dydu-footer', classes.root)} {...rest}>
        <Actions actions={actions} className={c('dydu-footer-actions', classes.actions)} id="dydu-language-selector" />
        {renderInput()}
      </div>
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
