import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';
import useStyles from './styles';
import Button from '../Button';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';


/**
 * Render secondary content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
export default function Secondary({ anchor }) {

  const { configuration } = useContext(ConfigurationContext);
  const { state: dialogState, toggleSecondary } = useContext(DialogContext);
  const root = useRef(null);
  const [ mode, setMode ] = useState(configuration.secondary.mode);
  const classes = useStyles({configuration});
  const { body, title, url } = dialogState.secondaryContent || {};
  const { boundaries } = configuration.dragon;

  if (boundaries && (mode === 'left' || mode === 'right') && anchor && anchor.current && root.current) {
    let { left: anchorLeft, right: anchorRight } = anchor.current.getBoundingClientRect();
    anchorRight = window.innerWidth - anchorRight;
    let { left, right, width } = root.current.getBoundingClientRect();
    right = window.innerWidth - right;
    if (left < 0 && mode !== 'right' && anchorRight > width) {
      setMode('right');
    }
    else if (right < 0 && mode !== 'left' && anchorLeft > width) {
      setMode('left');
    }
  }

  return dialogState.secondaryActive ? (
    <div className={classNames('dydu-secondary', `dydu-secondary-${mode}`, classes.base, classes[mode])}
         ref={root}>
      <div className={classNames('dydu-secondary-header', classes.header)}>
        {title && (
          <h1 children={title} className={classNames('dydu-secondary-title', classes.title)} />
        )}
        <div className={classNames('dydu-secondary-actions', classes.actions)}>
          <Button onClick={toggleSecondary(false)} type="button" variant="icon">
            <img alt="Close" src="icons/close.png" title="Close" />
          </Button>
        </div>
      </div>
      {body && (
        <div className={classNames('dydu-secondary-body', classes.body)}
             dangerouslySetInnerHTML={{__html: body}} />
      )}
      {url && (
        <iframe allow="fullscreen"
                className={classes.frame}
                importance="low"
                sandbox="allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-forms"
                src={url}
                title={url} />
      )}
    </div>
  ) : null;
}


Secondary.propTypes = {
  anchor: PropTypes.object,
};
