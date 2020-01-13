import c from 'classnames';
import qs from 'qs';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { Local } from '../../tools/storage';
import { ChatboxWrapper as Chatbox } from '../Chatbox';
import Teaser from '../Teaser';
import Wizard from '../Wizard';
import useStyles from './styles';


/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `wizard` URL parameter is found.
 */
export default function Application() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const hasWizard = qs.parse(window.location.search, {ignoreQueryPrefix: true}).wizard !== undefined;
  const initialMode = Local.get(Local.names.open, ~~configuration.application.open);
  const [ mode, setMode ] = useState(~~initialMode);
  const [ open, setOpen ] = useState(~~initialMode > 1);

  const toggle = value => () => setMode(~~value);

  useEffect(() => {
    const value = ~~mode > 1 ? 2 : (~~mode > 0 ? 1 : 0);
    setOpen(previous => previous || value > 1);
    Local.set(Local.names.open, value);
  }, [mode]);

  return (
    <div className={c('dydu-application', classes.root)}>
      {hasWizard && <Suspense children={<Wizard />} fallback={null} />}
      {open && (
        <Suspense fallback={null}>
          <Chatbox open={mode > 1} toggle={toggle} />
        </Suspense>
      )}
      <Teaser open={mode === 1} toggle={toggle} />
    </div>
  );
}
