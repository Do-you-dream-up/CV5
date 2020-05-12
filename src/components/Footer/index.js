import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Actions from '../Actions';
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
  const [ t, i ] = useTranslation('footer');
  const { languages = [] } = configuration.application;
  const { translate: hasTranslate } = configuration.footer;
  const actionTranslate = t('translate');

  const languagesMenu = [languages.sort().map(id => ({
    id,
    onClick: () => window.dydu && window.dydu.localization && window.dydu.localization.set(id),
    text: t(`rosetta.${id}`),
  }))];

  const actions = [{
    children: <img alt={actionTranslate} src="icons/flag.png" title={actionTranslate} />,
    items: () => languagesMenu,
    selected: () => i.languages[0],
    variant: 'icon',
    when: hasTranslate && languagesMenu.flat().length > 1,
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
