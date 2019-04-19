import PropTypes from 'prop-types';
import React from 'react';

import Configuration from '../../tools/configuration';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const { interactions } = this.props;
    const styles = Configuration.get('dialog.styles');
    return (
      <div className="dydu-history" style={styles}>
        {interactions.map((it, index) => ({...it, key: index}))}
      </div>
    );
  }
}


Dialog.propTypes = {
  interactions: PropTypes.array.isRequired,
};


export default Dialog;
