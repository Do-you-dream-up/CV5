import c from 'classnames';
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
         className={c('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle(2)}
         title={title} />
  );
}


Teaser.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
