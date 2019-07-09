import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Scroll from '../Scroll';
import Configuration from  '../../tools/configuration';


const styles = theme => ({
  bullet: {
    animationDirection: 'alternate',
    animationDuration: '.5s',
    animationIterationCount: 'infinite',
    animationName: '$pulse',
    backgroundColor: theme.palette.response.background,
    borderRadius: '50%',
    height: '.75em',
    marginLeft: '.25em',
    marginRight: '.25em',
    transform: 'scale(0)',
    width: '.75em',
    '&&': Configuration.getStyles('loader'),
  },
  root: {
    display: 'flex',
    marginLeft: '-.25em',
    marginRight: '-.25em',
  },
  '@keyframes pulse': {
    from: {transform: 'scale(0)'},
    to: {transform: 'scale(1)'},
  },
});


class Loader extends React.PureComponent {
  render() {
    const { classes, size: defaultSize = 30 } = this.props;
    const { size = defaultSize } = Configuration.get('loader');
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


Loader.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.number,
};


export default withStyles(styles)(Loader);
