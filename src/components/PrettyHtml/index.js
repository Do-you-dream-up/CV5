import {
  CAROUSEL_TEMPLATE,
  PRODUCT_TEMPLATE,
  QUICK_REPLY,
  knownTemplates,
  CAROUSEL_ARRAY_TEMPLATE,
} from '../../tools/template';
import { createElement, useEffect, useMemo, useState } from 'react';

import CarouselTemplate from '../CarouselTemplate/CarouselTemplate';
import ProductTemplate from '../ProductTemplate/ProductTemplate';
import PropTypes from 'prop-types';
import QuickreplyTemplate from '../QuickreplyTemplate';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useShadow } from '../../contexts/ShadowProvider';
import { useDialog } from '../../contexts/DialogContext';
import { cleanHtml } from '../../tools/helpers';
import { Local } from '../../tools/storage';

const RE_HREF_EMPTY = /href="#"/g;
//const RE_ONCLICK_LOWERCASE = /onclick/g;
const RE_HREF = /(<a href([^>]+)>)/g;
/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({ carousel, children, className, component, html, templatename, type, ...rest }) {
  const [htmlContent, setHtmlContent] = useState('');
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const { configuration } = useConfiguration();
  const { NameUser, NameBot } = configuration.interaction;
  const { shadowAnchor } = useShadow();
  const { setZoomSrc } = useDialog();
  // Assigning setZoomSrc to window.setZoom for the onclick event handler
  // Haven't found a better solution to handle the zoom
  window.setZoom = setZoomSrc;

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
    if (!html) {
      setHtmlContent('');
      return;
    }
    let _html = html;
    const hasEmptyHref = (el) => el.match(RE_HREF_EMPTY);

    if (hrefMatchs) {
      hrefMatchs.forEach((el) => {
        if (hasEmptyHref(el)) {
          _html = _html.replace(el, el.replace(RE_HREF_EMPTY, 'href="javascript:void(0)"'));
        }
      });
    }

    const filters = getFilters();
    filters.forEach((filter) => {
      if (filter.test({ name: 'img' })) {
        _html = filter.process({ html: _html });
      }
    });
    _html = cleanHtml(_html);

    setHtmlContent(_html);
  }, [hrefMatchs, html]);

  // to focus the first interactive elements of the last response of the bot
  useEffect(() => {
    if (shadowAnchor?.querySelectorAll('.dydu-bubble-body')) {
      const responsesBotContentArray = Array.from(shadowAnchor?.querySelectorAll('.dydu-bubble-body'));
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
    if (type === 'sidebar') {
      return t('screenReader.sidebar');
    } else if (type === 'response') {
      if (Local.livechatType.load()) {
        return t('screenReader.livechat');
      }
      return botName;
    } else {
      return userName;
    }
  }, [botName, type, userName]);

  return createElement(
    component,
    { className: c(classes.root, className), ...rest },
    <>
      {children}
      {<p className={classes.srOnly} dangerouslySetInnerHTML={{ __html: interactionType }}></p>}
      {templatename === PRODUCT_TEMPLATE && <ProductTemplate html={htmlContent} />}
      {(templatename === CAROUSEL_TEMPLATE || templatename === CAROUSEL_ARRAY_TEMPLATE) && (
        <CarouselTemplate html={htmlContent} />
      )}
      {templatename === QUICK_REPLY && <QuickreplyTemplate html={htmlContent} />}
      {!knownTemplates.includes(templatename) && htmlContent && (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
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

const getFilters = () => [
  {
    test: ({ name }) => name === 'img',
    process: (props) => {
      let html = props.html;
      const imgMatch = html.match(/<img[^>]+>/g);

      if (imgMatch) {
        imgMatch.forEach((imgTag) => {
          const srcMatch = imgTag.match(/src=['"](.*?)['"]/);
          if (srcMatch) {
            const newImgTag = imgTag.replace(
              '>',
              ` tabindex="0" onclick="window.setZoom('${srcMatch[1]}')" onkeypress="if(event.key === 'Enter') window.setZoom('${srcMatch[1]}')">`,
            );
            html = html.replace(imgTag, newImgTag);
          }
        });
      }
      return html;
    },
  },
];
