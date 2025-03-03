import c from 'classnames';
import useStyles from './styles';
import dydu from '../../tools/dydu';
import { useTranslation } from 'react-i18next';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225.55 266.9" aria-hidden={true}>
          <g data-name="Calque 2">
            <g data-name="Calque 1">
              <path
                d="M173.06 69.42a100.84 100.84 0 01-95.8 132.14 77.18 77.18 0 01-24.77-4.08 100.81 100.81 0 0095.8 69.42v-47a77.26 77.26 0 0024.77-150.48"
                fill="#ff5252"
              />
              <path
                d="M148.29 65.34a77.22 77.22 0 0124.77 4.08A100.83 100.83 0 0077.26 0v47a77.26 77.26 0 00-24.77 150.48 100.82 100.82 0 0195.8-132.14"
                fill="#7acbfc"
              />
              <path
                d="M178 100.78a100.65 100.65 0 00-5-31.36 77.24 77.24 0 00-24.78-4.08 100.82 100.82 0 00-95.73 132.14 77.18 77.18 0 0024.77 4.08A100.78 100.78 0 00178 100.78"
                fill="#3636b9"
              />
            </g>
          </g>
        </svg>
        <a
          href={lang === 'fr' ? 'https://www.dydu.ai' : 'https://www.dydu.ai/en'}
          target="_blank"
          rel="noreferrer"
          aria-label={'dydu ' + t('general.linkNewWindow')}
        >
          dydu
        </a>
      </p>
    </div>
  );
};
export default PoweredBy;
