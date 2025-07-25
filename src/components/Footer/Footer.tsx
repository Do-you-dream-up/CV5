import Actions, { ActionProps } from '../Actions/Actions';

import Input from '../Input/Input';
import UploadInput from '../UploadInput/UploadInput';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { useBotInfo } from '../../contexts/BotInfoContext';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';
import { useEffect, useState } from 'react';

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

  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
}

export default function Footer({ onRequest, onResponse, onWheel, ...rest }: FooterProps) {
  const { showButtonUploadFile } = useUploadFile() || {};

  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });
  const [t] = useTranslation('translation');
  const selectedLanguage = dydu.getLocale();
  const { translate: hasTranslate } = configuration?.footer || {};
  const { botLanguages } = useBotInfo();

  const [hasTTSError, setHasTTSError] = useState<boolean>(false);

  useEffect(() => {
    if (hasTTSError) {
      setTimeout(() => setHasTTSError(false), 10000);
    }
  }, [hasTTSError]);

  const actionTranslate = t('footer.translate');

  const handleLanguageChange = (id) => {
    window.dydu?.localization?.set(id);
  };

  const languagesMenu = [
    botLanguages &&
      botLanguages.map((id) => ({
        icon: `flags/${id}.png`,
        id,
        onClick: () => handleLanguageChange(id),
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
        <Input
          setHasTTSError={setHasTTSError}
          focus={focus}
          onRequest={onRequest}
          onResponse={onResponse}
          id="dydu-footer-input"
        />
      </div>
    );
  return (
    <>
      {hasTTSError ? (
        <div className={c('dydu-footer-error', classes.error)}>{t('footer.voice.tts.notAllowed')}</div>
      ) : null}
      <div className={c('dydu-footer', classes.root)} {...rest} onWheel={onWheel}>
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
