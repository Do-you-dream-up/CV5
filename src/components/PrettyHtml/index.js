import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Prettify children and string passed as parameter.
 *
 * Basically an opinionated reset.
 */
export default function PrettyHtml({ children, className, component, html, ...rest }) {
  const classes = useStyles();
  return React.createElement(component, {className: c(classes.root, className), ...rest}, (
    <>
      {children}
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
};
