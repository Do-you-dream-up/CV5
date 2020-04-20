import c from 'classnames';
import qs from 'qs';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { Local } from '../../tools/storage';
import Teaser from '../Teaser';
import useStyles from './styles';


const Chatbox = React.lazy(() => import(
  // webpackChunkName: "chatbox"
  '../Chatbox'
).then(module => ({default: module.ChatboxWrapper})));
const Wizard = React.lazy(() => import(
  // webpackChunkName: "wizard"
  '../Wizard'
));


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
    setOpen(mode > 1);
    Local.set(Local.names.open, Math.max(mode, 1));
  }, [mode]);

  return (
    <div className={c('dydu-application', classes.root)}>
      {hasWizard && <Suspense children={<Wizard />} fallback={null} />}
      {open && (
        <Suspense fallback={null}>
          <Chatbox extended={mode > 2} open={mode > 1} toggle={toggle} />
        </Suspense>
      )}
      <Teaser open={mode === 1} toggle={toggle} />
    </div>
  );
}
