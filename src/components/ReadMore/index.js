import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ReadMore({children, maxChar}) {

    const fullText = children;
    const { ready, t } = useTranslation('translation');
    const readmore = t('template.readmore');
    const readless = t('template.readless');
    const [isTruncated, setIsTruncated] = useState(true);
    const displayedText = isTruncated ? fullText.slice(0, maxChar) : fullText;

    const toggleIsTruncated = () => {
        setIsTruncated(!isTruncated);
    };

    return ready && (
      <div>
        <div dangerouslySetInnerHTML={{__html: displayedText}} />
        <span className={c('dydu-readmore')} onClick={toggleIsTruncated}>
          <a>{isTruncated ? readmore : readless}</a>
        </span>
      </div>
    );
}

ReadMore.propTypes = {
    children: PropTypes.string,
    maxChar: PropTypes.number
  };
