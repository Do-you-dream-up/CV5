import classNames from 'classnames';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import useStyles from './styles';
import Chatbox from '../Chatbox';
import Dragon from '../Dragon';
import Teaser from '../Teaser';
import Wizard from '../Wizard';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { Local } from '../../tools/storage';


/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `wizard` URL parameter is found.
 */
export default function Application() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const hasWizard = qs.parse(window.location.search, {ignoreQueryPrefix: true}).wizard !== undefined;
  const initialMode = Local.get(Local.names.open);
  const defaultMode = configuration.application.open;
  const [ mode, setMode ] = useState(initialMode !== null ? ~~initialMode : ~~defaultMode);

  const toggle = value => () => setMode(~~value);

  useEffect(() => {
    const value = ~~mode > 1 ? 2 : (~~mode > 0 ? 1 : 0);
    Local.set(Local.names.open, value);
  }, [mode]);

  return (
    <div className={classNames('dydu-application', classes.root)}>
      {hasWizard && <Wizard />}
      <Dragon component={Chatbox} open={mode > 1} toggle={toggle} />
      <Teaser open={mode === 1} toggle={toggle} />
    </div>
  );
}
