import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';


const styles = {
  root: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '1em',
  },
};


class Dialog extends React.PureComponent {
  render() {
    const { classes, interactions } = this.props;
    return (
      <div className={classNames('dydu-history', classes.root)}>
        {interactions.map((it, index) => ({...it, key: index}))}
      </div>
    );
  }
}


Dialog.propTypes = {
  classes: PropTypes.object.isRequired,
  interactions: PropTypes.array.isRequired,
};


export default withStyles(styles)(Dialog);