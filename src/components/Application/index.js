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
  const isOpen = Local.get(Local.names.open);
  const hasWizard = qs.parse(window.location.search, {ignoreQueryPrefix: true}).wizard !== undefined;
  const [ open, setOpen ] = useState(isOpen === null ? !!configuration.application.open : !!isOpen);

  const toggle = value => () => {
    value = value === undefined ? !open : !!value;
    setOpen(value);
  };

  useEffect(() => {
    Local.set(Local.names.open, open);
  }, [open]);

  return (
    <div className={classNames('dydu-application', classes.root)}>
      {hasWizard && <Wizard />}
      <Dragon component={Chatbox} open={open} toggle={toggle} />
      <Teaser open={!open} toggle={toggle} />
    </div>
  );
}
