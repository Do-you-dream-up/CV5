import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Input from '../Input';
import { withConfiguration } from '../../tools/configuration';


/**
 * The footer typically contains the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
export default withConfiguration(withStyles(styles)(class Footer extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
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
}));
