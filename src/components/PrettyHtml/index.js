import { CAROUSSEL_TEMPLATE, PRODUCT_TEMPLATE, QUICK_REPLY, knownTemplates } from '../../tools/template';
import { createElement, useEffect, useMemo, useState } from 'react';

import CarouselTemplate from '../CarouselTemplate';
import ProductTemplate from '../ProductTemplate';
import PropTypes from 'prop-types';
import QuickreplyTemplate from '../QuickreplyTemplate';
import c from 'classnames';
import parse from 'html-react-parser';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useCustomRenderer from './useCustomRenderer';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

const RE_HREF_EMPTY = /href="#"/g;
//const RE_ONCLICK_LOWERCASE = /onclick/g;
const RE_HREF = /(<a href([^>]+)>)/g;

/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({ carousel, children, className, component, html, templatename, type, ...rest }) {
  const [htmlContent, setHtmlContent] = useState(null);
  const customRenderer = useCustomRenderer();
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const { configuration } = useConfiguration();
  const { NameUser, NameBot } = configuration.interaction;

  const userName = useMemo(
    () => (NameUser !== '' ? `${NameUser} ${t('screenReader.say')}` : t('screenReader.me')),
    [NameUser, t],
  );

  const botName = useMemo(
    () => (NameBot !== '' ? `${NameBot} ${t('screenReader.say')}` : t('screenReader.chatbot')),
    [NameBot, t],
  );

  const hrefMatchs = useMemo(() => html && html.match(RE_HREF), [html]);

  useEffect(() => {
    let _html = html;
    const hasEmptyHref = (el) => el.match(RE_HREF_EMPTY);
    if (hrefMatchs)
      hrefMatchs.forEach((el) => {
        if (hasEmptyHref(el)) _html = _html.replace(el, el.replace(RE_HREF_EMPTY, 'href="javascript:void(0)"'));
      });

    setHtmlContent(_html);
  }, [hrefMatchs, html]);

  // to focus the first interactive elements of the last response of the bot
  useEffect(() => {
    if (document.querySelectorAll('.dydu-bubble-body')) {
      const responsesBotContentArray = Array.from(document.querySelectorAll('.dydu-bubble-body'));
      const lastResponseBotContent = responsesBotContentArray[responsesBotContentArray.length - 1];

      responsesBotContentArray.forEach((elementParent) => {
        if (elementParent === lastResponseBotContent) {
          const interactiveElementsArray = Array.from(elementParent.querySelectorAll('a'));

          interactiveElementsArray.forEach((elementChild) => {
            // focus() on carousel link make bugs on the width of the carousel or step actions
            if (
              elementChild === interactiveElementsArray[0] &&
              !carousel &&
              knownTemplates.includes(templatename) === false
            ) {
              elementChild.focus();
            }
          });
        }
      });
    }
  }, [carousel, templatename]);

  const interactionType = useMemo(() => {
    return type === 'response' ? botName : userName;
  }, [botName, type, userName]);

  return createElement(
    component,
    { className: c(classes.root, className), ...rest },
    <>
      {children}
      {<span className={classes.srOnly} dangerouslySetInnerHTML={{ __html: interactionType }}></span>}
      {templatename === PRODUCT_TEMPLATE && <ProductTemplate html={htmlContent} />}
      {templatename === CAROUSSEL_TEMPLATE && <CarouselTemplate html={htmlContent} />}
      {templatename === QUICK_REPLY && <QuickreplyTemplate html={htmlContent} />}
      {!knownTemplates.includes(templatename) && htmlContent && parse(htmlContent, customRenderer)}
    </>,
  );
}

PrettyHtml.defaultProps = {
  component: 'div',
};

PrettyHtml.propTypes = {
  carousel: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  html: PropTypes.string,
  templatename: PropTypes.string,
  type: PropTypes.string,
};
