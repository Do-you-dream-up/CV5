import c from 'classnames';
import useStyles from './styles';
import dydu from '../../tools/dydu';
import { useTranslation } from 'react-i18next';
import { asset } from '../../tools/helpers';

/**
 * Display the "powered by dydu" phrase at the end of the conversation, if this parameter is active into the Dialog component
 */
const PoweredBy = () => {
  const classes = useStyles();
  const lang = dydu.getLocale();
  const { t } = useTranslation('translation');

  return (
    <div className={c(classes.poweredText)} lang="en">
      <p>
        powered by
        <a
          href={lang === 'fr' ? 'https://www.dydu.ai' : 'https://www.dydu.ai/en'}
          target="_blank"
          rel="noreferrer"
          aria-label={'dydu ' + t('general.linkNewWindow')}
        >
          <img alt={'Powered By Dydu'} className={classes.poweredByLogo} src={asset('dydu-poweredby.svg')} />
        </a>
      </p>
    </div>
  );
};
export default PoweredBy;
