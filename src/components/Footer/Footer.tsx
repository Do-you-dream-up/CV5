import Actions, { ActionProps } from '../Actions/Actions';
import { useEffect, useState } from 'react';

import Input from '../Input/Input';
import UploadInput from '../UploadInput/UploadInput';
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

interface FooterProps {
  onRequest?: (value: string) => void;
  onResponse?: (value: Servlet.ChatResponseValues) => void;
  [key: string]: any;
}

export default function Footer({ onRequest, onResponse, ...rest }: FooterProps) {
  const { showButtonUploadFile } = useUploadFile() || {};

  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });
  const [t, i] = useTranslation('translation');
  const [selectedLanguage, setSelectedLanguage] = useState(configuration?.application.defaultLanguage[0]);
  const { languages } = configuration?.application || {};
  const { translate: hasTranslate } = configuration?.footer || {};

  const actionTranslate = t('footer.translate');

  useEffect(() => {
    if (i.languages) setSelectedLanguage(i.languages[0]);
  }, [i, t]);

  const languagesMenu = [
    languages &&
      languages.sort().map((id) => ({
        icon: `flags/${id}.png`,
        id,
        onClick: () => window.dydu && window.dydu.localization && window.dydu.localization.set(id, languages),
        text: t(`footer.rosetta.${id}`),
      })),
  ];

  const actions: ActionProps[] = [
    {
      children: (
        <img
          alt={actionTranslate}
          src={`${process.env.PUBLIC_URL}flags/${selectedLanguage}.png`}
          title={actionTranslate}
          className="language-selector-icon"
        />
      ),
      items: () => languagesMenu,
      selected: () => selectedLanguage,
      variant: 'icon',
      when: hasTranslate && languagesMenu.flat().length > 1,
    },
  ];

  const renderInput = () =>
    showButtonUploadFile ? (
      <UploadInput />
    ) : (
      <div className={classes.content}>
        <Input focus={focus} onRequest={onRequest} onResponse={onResponse} id="dydu-footer-input" />
      </div>
    );

  return (
    <>
      <div className={c('dydu-footer', classes.root)} {...rest}>
        <Actions
          actions={actions}
          className={c('dydu-footer-actions', classes.actions)}
          testId="dydu-language-selector"
          id="dydu-language-selector"
        />
        {renderInput()}
      </div>
    </>
  );
}
