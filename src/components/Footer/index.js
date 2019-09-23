import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';
import Input from '../Input';
import { withConfiguration } from '../../tools/configuration';


/**
 * The footer typically contains the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
function Footer({ configuration, onRequest, onResponse, ...rest }) {
  const classes = useStyles({configuration});
  return (
    <footer className={classNames('dydu-footer', classes.root)} {...rest}>
      <Input onRequest={onRequest} onResponse={onResponse} />
    </footer>
  );
}


Footer.propTypes = {
  configuration: PropTypes.object.isRequired,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};


export default withConfiguration(Footer);
