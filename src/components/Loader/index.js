import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import Scroll from '../Scroll';
import useStyles from './styles';


/**
 * The Loader suggests to the user that the chatbot is *thinking* by display a
 * loader animated with CSS styling.
 *
 * The loader size determines the number of bullets.
 */
export default function Loader({ size: defaultSize }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const size = defaultSize || configuration.loader.size;
  return (
    <Scroll className={c('dydu-loader', classes.root)}>
      {[...Array(size)].map((it, index) => (
        <div className={c('dydu-loader-bullet', classes.bullet)}
             key={index}
             style={{animationDelay: `${index / 10}s`}} />
      ))}
    </Scroll>
  );
}


Loader.defaultProps = {
  size: 3,
};


Loader.propTypes = {
  size: PropTypes.number,
};
