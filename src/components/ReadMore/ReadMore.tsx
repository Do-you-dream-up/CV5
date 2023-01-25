import c from 'classnames';
import { useTranslation } from 'react-i18next';

interface ReadMoreProps {
  isTruncated: boolean;
  toggleIsTruncated: () => void;
  children: string;
  maxChar: number;
}

export default function ReadMore({ isTruncated, toggleIsTruncated, children, maxChar }: ReadMoreProps) {
  const { t } = useTranslation();

  const displayedText = isTruncated ? children.slice(0, maxChar) : children;

  return displayedText ? (
    <div>
      <div dangerouslySetInnerHTML={{ __html: displayedText }} />
      <span className={c('dydu-readmore')} onClick={toggleIsTruncated}>
        <a>{isTruncated ? t('template.readmore') : t('template.readless')}</a>
      </span>
    </div>
  ) : null;
}
