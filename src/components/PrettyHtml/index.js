import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CAROUSSEL_TEMPLATE, PRODUCT_TEMPLATE, QUICK_REPLY, knownTemplates } from '../../tools/template';
import CarouselTemplate from '../CarouselTemplate';
import ProductTemplate from '../ProductTemplate';
import QuickreplyTemplate from '../QuickreplyTemplate';
import useStyles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';

/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({
  children,
  className,
  component,
  hasExternalLink,
  html,
  templatename,
  type,
  ...rest
}) {
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const { configuration } = useContext(ConfigurationContext);
  const { NameUser, NameBot } = configuration.interaction;

  const displayScreenreaderUser = useCallback(() => {
    if (NameUser !== '') {
      return `${NameUser} ${t('screenReader.say')}`;
    } else {
      return t('screenReader.me');
    }
  }, [NameUser, t]);

  const displayScreenreaderBot = useCallback(() => {
    if (NameBot !== '') {
      return `${NameBot} ${t('screenReader.say')}`;
    } else {
      return t('screenReader.chatbot');
    }
  }, [NameBot, t]);

  const RE_ONCLICK = /onclick=".+?"/gm;
  const RE_REWORD = /class="reword/gm;
  const RE_HREF = /(<a href([^>]+)>)/g;
  const RE_HREF_EMPTY = /href="#"/g;

  const hrefMatchs = html && html.match(RE_HREF);

  hrefMatchs &&
    hrefMatchs.map((el) => {
      if (!el.match(RE_REWORD)) {
        html = html.replace(el, el.replace(RE_ONCLICK, ''));
      } else {
        html = html.replace(el, el.replace(RE_HREF_EMPTY, 'href="javascript:void(0)"'));
      }
    });

  // to focus the first interactive elements of the last response of the bot
  useEffect(() => {
    if (document.querySelectorAll('.dydu-bubble-body')) {
      const responsesBotContentArray = Array.from(document.querySelectorAll('.dydu-bubble-body'));
      const lastResponseBotContent = responsesBotContentArray[responsesBotContentArray.length - 1];

      responsesBotContentArray.forEach((elementParent) => {
        if (elementParent === lastResponseBotContent) {
          const interactiveElementsArray = Array.from(elementParent.querySelectorAll('a'));

          interactiveElementsArray.forEach((elementChild) => {
            if (elementChild === interactiveElementsArray[0]) {
              elementChild.focus();
            }
          });
        }
      });
    }
  }, []);

  const interactionType = type === 'response' ? displayScreenreaderBot() : displayScreenreaderUser();
  return React.createElement(
    component,
    { className: c(classes.root, className), ...rest },
    <>
      {children}
      {<span className={classes.srOnly} dangerouslySetInnerHTML={{ __html: interactionType }}></span>}
      {templatename === PRODUCT_TEMPLATE && <ProductTemplate html={html} />}
      {templatename === CAROUSSEL_TEMPLATE && <CarouselTemplate html={html} />}
      {templatename === QUICK_REPLY && <QuickreplyTemplate html={html} />}
      {!knownTemplates.includes(templatename) && <div dangerouslySetInnerHTML={{ __html: html }} />}
      {hasExternalLink && (
        <img className={classes.externalLinkIcon} src={`${process.env.PUBLIC_URL}icons/dydu-open-in-new-black.svg`} />
      )}
    </>,
  );
}

PrettyHtml.defaultProps = {
  component: 'div',
};

PrettyHtml.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  hasExternalLink: PropTypes.bool,
  html: PropTypes.string,
  templatename: PropTypes.string,
  type: PropTypes.string,
};
