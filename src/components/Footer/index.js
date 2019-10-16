import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import Input from '../Input';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * The footer typically contains the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
export default function Footer({ onRequest, onResponse, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  return (
    <footer className={classNames('dydu-footer', classes.root)} {...rest}>
      <Input onRequest={onRequest} onResponse={onResponse} />
    </footer>
  );
}


Footer.propTypes = {
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};
