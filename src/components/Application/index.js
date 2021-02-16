import c from 'classnames';
import qs from 'qs';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { Local } from '../../tools/storage';
import Teaser from '../Teaser';
import useStyles from './styles';
// eslint-disable-next-line import/no-unresolved
import '../../../public/override/style.css';


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
  const event = useContext(EventsContext).onEvent('chatbox');
  const classes = useStyles({configuration});
  const hasWizard = qs.parse(window.location.search, {ignoreQueryPrefix: true}).wizard !== undefined;
  const initialMode = Local.get(Local.names.open, ~~configuration.application.open);
  const [ mode, setMode ] = useState(~~initialMode);
  // eslint-disable-next-line no-unused-vars
  const [ open, setOpen ] = useState(~~initialMode > 1);
  const { background } = configuration.application;

  let customFont = configuration.font.url;
  if (customFont && document.getElementById('font') && customFont !== document.getElementById('font').href) {
    document.getElementById('font').href = customFont;
  }

  const toggle = value => () => setMode(~~value);

  useEffect(() => {
    setOpen(mode > 1);
    Local.set(Local.names.open, Math.max(mode, 1));
  }, [mode]);

  useEffect(() => {
    event('loadChatbox');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      {hasWizard && <Suspense children={<Wizard />} fallback={null} />}
      <DialogProvider>
        <>
          {background && !hasWizard && <iframe
            className={c('dydu-background', classes.background)}
            width='100%'
            height='100%'
            src={`${background}`}/>}
          <Suspense fallback={null}>
            <Chatbox extended={mode > 2} open={mode > 1} toggle={toggle} mode={mode}/>
          </Suspense>
          <Teaser open={mode === 1} toggle={toggle} />
        </>
      </DialogProvider>
    </div>
  );
}
