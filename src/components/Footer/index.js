import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Input from '../Input';


class Footer extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  render() {
    const { classes, onRequest, onResponse, ...rest } = this.props;
    return (
      <footer className={classNames('dydu-footer', classes.root)} {...rest}>
        <Input onRequest={onRequest} onResponse={onResponse} />
      </footer>
    );
  }
}


export default withStyles(styles)(Footer);
