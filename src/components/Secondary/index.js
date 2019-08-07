import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from '../Button';
import { DialogContext } from '../../contexts/DialogContext';
import Configuration from '../../tools/configuration';


const styles = theme => ({
  actions: {
    display: 'flex',
    marginLeft: 'auto',
    '& > :not(:first-child)': {
      marginLeft: '1em',
    },
  },
  header: {
    backgroundColor: `${theme.palette.background.secondary}CC`,
    display: 'flex',
    padding: '1em',
    position: 'sticky',
    top: 0,
  },
  over: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 'unset !important',
  },
  base: {
    backgroundColor: theme.palette.background.secondary,
    overflowY: 'auto',
    '&&': Configuration.getStyles('secondary'),
  },
  body: {
    padding: '1em',
  },
  side: {
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    marginRight: '1em',
    position: 'absolute',
    right: '100%',
    top: 0,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      left: 0,
      marginRight: 'unset',
      right: 0,
      width: 'unset !important',
    },
  },
  title: {
    margin: 0,
  },
});


class Secondary extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
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
}


export default withStyles(styles)(Secondary);
