import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Input from '../Input';
import useStyles from './styles';


/**
 * The footer typically renders the input field for the user to type text into
 * the conversation.
 *
 * It transports the function to call whenever input is submitted and a second
 * function to handle the response.
 */
export default function Footer({ focus, onRequest, onResponse, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  return (
    <footer className={c('dydu-footer', classes.root)} {...rest}>
      <div className={classes.content}>
        <Input focus={focus} onRequest={onRequest} onResponse={onResponse} />
      </div>
    </footer>
  );
}


Footer.defaultProps = {
  focus: true,
};


Footer.propTypes = {
  focus: PropTypes.bool,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};
