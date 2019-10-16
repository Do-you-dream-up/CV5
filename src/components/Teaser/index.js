import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * Minified version of the chatbox.
 */
export default function Teaser({ open, toggle }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { title } = configuration.teaser;

  return (
    <div children={title}
         className={classNames('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle()} />
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
