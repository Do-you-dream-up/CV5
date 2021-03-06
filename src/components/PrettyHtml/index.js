import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CAROUSSEL_TEMPLATE, PRODUCT_TEMPLATE,  QUICK_REPLY, knownTemplates } from  '../../tools/template';
import CarouselTemplate from  '../CarouselTemplate';
import ProductTemplate from  '../ProductTemplate';
import QuickreplyTemplate from '../QuickreplyTemplate';
import useStyles from './styles';


/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({ children, className, component, hasExternalLink, html, templatename, type, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('translation');

  const RE_EMAIL = /(.+)(<a href="mailto:\S+@\S+\.\S+").*(>.+<\/a>)(.+)/g;
  const RE_LINK = /(<a href="(http(s)?:\/\/)?\S+\.\S+").*(>.+<\/a>)/g;
  const RE_ONCLICK = /onclick=".+?"/gm;

  const htmlCleanup = html && html.match(RE_EMAIL) || html && html.match(RE_LINK) ?
                      html.replace(RE_ONCLICK, '') :
                      html;

  const interactionType = type === 'response' ? t('screenReader.chatbot') : t('screenReader.me');
  return React.createElement(component, {className: c(classes.root, className), ...rest}, (
    <>
      { children }
      { <span className={classes.srOnly} dangerouslySetInnerHTML={{__html: interactionType}}></span> }
      { templatename === PRODUCT_TEMPLATE && <ProductTemplate html={html} /> }
      { templatename === CAROUSSEL_TEMPLATE && <CarouselTemplate html={html} /> }
      { templatename === QUICK_REPLY && <QuickreplyTemplate html={html} /> }
      { !knownTemplates.includes(templatename) && <div dangerouslySetInnerHTML={{__html: htmlCleanup}} /> }
      { hasExternalLink && <img className={classes.externalLinkIcon} src={`${process.env.PUBLIC_URL}icons/dydu-open-in-new-black.svg`} /> }
    </>
  ));
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
