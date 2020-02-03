import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Actions from '../Actions';
import Input from '../Input';
import useStyles from './styles';
import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation('footer');
  const { more } = configuration.footer;
  const actionExpand = t('expand');

  const actions = [{
    children: <img alt={actionExpand} src="icons/chevron-up.black.png" title={actionExpand} />,
    variant: 'icon',
    when: more,
  }];

  return (
    <footer className={c('dydu-footer', classes.root)} {...rest}>
      <Actions actions={actions} className={c('dydu-footer-actions', classes.actions)} />
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
