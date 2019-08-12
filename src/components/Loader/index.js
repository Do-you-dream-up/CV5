import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Scroll from '../Scroll';
import Configuration from  '../../tools/configuration';


class Loader extends React.PureComponent {

  static defaultProps = {
    size: 3,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    size: PropTypes.number,
  };

  render() {
    const { classes, size: defaultSize } = this.props;
    const { size=defaultSize } = Configuration.get('loader');
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
}


export default withStyles(styles)(Loader);
