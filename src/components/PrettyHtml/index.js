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
export default function PrettyHtml({ children, className, component, html, type, ...rest }) {

  const classes = useStyles();
  const { t } = useTranslation('screenReader');

  const interactionType = type === 'response' ? t('chatbot') : t('me');
  return React.createElement(component, {className: c(classes.root, className), ...rest}, (
    <>
      {children}
      {<span className={classes.srOnly} dangerouslySetInnerHTML={{__html: interactionType}}></span>}
      {html && <div dangerouslySetInnerHTML={{__html: html}} />}
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
  html: PropTypes.string,
  type: PropTypes.string,
};
