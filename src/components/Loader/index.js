import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import Scroll from '../Scroll';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';


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
    <Scroll className={classNames('dydu-loader', classes.root)}>
      {[...Array(size)].map((it, index) => (
        <div className={classNames('dydu-loader-bullet', classes.bullet)}
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
