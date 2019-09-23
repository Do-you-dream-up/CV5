import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';
import { withConfiguration } from '../../tools/configuration';


/**
 * Minified version of the chatbox.
 */
function Teaser({ configuration, open, toggle }) {

  const classes = useStyles({ configuration });
  const { title } = configuration.teaser;

  return (
    <div children={title}
         className={classNames('dydu-teaser', classes.root, {[classes.hidden]: !open})}
         onClick={toggle()} />
  );
}


Teaser.propTypes = {
    configuration: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };


export default withConfiguration(Teaser);
