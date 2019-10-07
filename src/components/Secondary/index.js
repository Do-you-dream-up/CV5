import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import Button from '../Button';
import { DialogContext } from '../../contexts/DialogContext';
import { withConfiguration } from '../../tools/configuration';


/**
 * Render secondary content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
function Secondary({ configuration, mode}) {

  const { state: dialogState, toggleSecondary } = useContext(DialogContext);
  const classes = useStyles({configuration});
  const { body, title, url } = dialogState.secondaryContent || {};

  return dialogState.secondaryActive ? (
    <div className={classNames(
      'dydu-secondary', `dydu-secondary-${mode}`, classes.base, classes[mode],
    )}>
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
  configuration: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['over', 'side']).isRequired,
};


export default withConfiguration(Secondary);
