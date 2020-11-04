import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';


/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({ children, className, component, hasExternalLink, html, type, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('translation');

  const interactionType = type === 'response' ? t('screenReader.chatbot') : t('screenReader.me');
  return React.createElement(component, {className: c(classes.root, className), ...rest}, (
    <>
      {children}
      {<span className={classes.srOnly} dangerouslySetInnerHTML={{__html: interactionType}}></span>}
      {html && <div dangerouslySetInnerHTML={{__html: html}} />}
      {hasExternalLink && <img className={classes.externalLinkIcon} src={`${process.env.PUBLIC_URL}icons/open-in-new.black.png`} />}
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
  type: PropTypes.string,
};
