import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import { DialogContext } from '../../contexts/DialogContext';
import { withConfiguration } from '../../tools/configuration';


/**
 * Render secondary content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
export default withConfiguration(withStyles(styles)(class Secondary extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['over', 'side']).isRequired,
  };

  render() {
    const { state: dialogState, toggleSecondary } = this.context;
    const { classes, mode } = this.props;
    const { body, title } = dialogState.secondaryContent || {};
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
      </div>
    ) : null;
  }
}));
