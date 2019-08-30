import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Scroll from '../Scroll';
import { withConfiguration } from  '../../tools/configuration';


/**
 * The Loader suggests to the user that the chatbot is *thinking* by display a
 * loader animated with CSS styling.
 *
 * The loader size determines the number of bullets.
 */
export default withConfiguration(withStyles(styles)(class Loader extends React.PureComponent {

  static defaultProps = {
    size: 3,
  };

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    size: PropTypes.number,
  };

  render() {
    const { classes, configuration, size: defaultSize } = this.props;
    const { size } = defaultSize || configuration.loader;
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
}));
