import PropTypes from 'prop-types';
import c from 'classnames';
import { useTranslation } from 'react-i18next';

export default function ReadMore({ isTruncated, toggleIsTruncated, children, maxChar }) {
  const fullText = children;
  const { ready, t } = useTranslation('translation');
  const readmore = t('template.readmore');
  const readless = t('template.readless');
  const displayedText = isTruncated ? fullText.slice(0, maxChar) : fullText;

  return (
    ready && (
      <div>
        <div dangerouslySetInnerHTML={{ __html: displayedText }} />
        <span className={c('dydu-readmore')} onClick={toggleIsTruncated}>
          <a>{isTruncated ? readmore : readless}</a>
        </span>
      </div>
    )
  );
}

ReadMore.propTypes = {
  isTruncated: PropTypes.bool,
  toggleIsTruncated: PropTypes.func,
  children: PropTypes.string,
  maxChar: PropTypes.number,
};
