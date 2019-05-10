import PropTypes from 'prop-types';
import React from 'react';

import Scroll from '../Scroll';
import { withTheme } from '../../theme';
import Configuration from  '../../tools/configuration';

import './index.scss';


class Loader extends React.PureComponent {
  render() {
    const { size, theme } = this.props;
    const configuration = Configuration.get('loader', {});
    const styles = {
      backgroundColor: theme.palette.response.background,
      ...Configuration.getStyles(configuration, theme),
    };
    return (
      <Scroll className="dydu-loader">
        {[...Array(size || configuration.size || 3)].map((it, index) => (
          <div className="dydu-loader-bullet"
               key={index}
               style={{animationDelay: `${index / 10}s`, ...styles}} />
        ))}
      </Scroll>
    );
  }
}


Loader.propTypes = {
  size: PropTypes.number,
  theme: PropTypes.object.isRequired,
};


export default withTheme(Loader);
