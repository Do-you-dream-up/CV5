import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../Button';
import useStyles from './styles';


/**
 * Wrap children with a paper-like UI.
 *
 * See Material design: https://material.io/.
 */
export default function Paper({ actions, children, className, title, ...rest }) {
  const classes = useStyles();
  return (
    <div className={c('dydu-paper', classes.root, className)} {...rest}>
      {title && <h3 children={title} className={c('dydu-paper-header', classes.header)} />}
      {children && <div children={children} className="dydu-paper-body" />}
      {actions.length > 0 && (
        <div className={c('dydu-paper-actions', classes.actions)}>
          {actions.map((it, index) => <Button children={it.text} key={index} onClick={it.action} />)}
        </div>
      )}
    </div>
  );
}


Paper.defaultProps = {
  actions: [],
};


Paper.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  })),
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
};
