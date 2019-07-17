import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from './Button';
import { DialogContext } from '../contexts/DialogContext';
import Configuration from '../tools/configuration';


const styles = theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'sticky',
    top: 0,
    '& > :not(:first-child)': {
      marginLeft: '1em',
    },
  },
  over: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  base: {
    backgroundColor: theme.palette.background.secondary,
    overflowY: 'auto',
    padding: '1em',
    '&&': Configuration.getStyles('secondary'),
  },
  side: {
    bottom: 0,
    left: '-100%',
    marginRight: '1em',
    position: 'absolute',
    right: '100%',
    top: 0,
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
        <div className={classNames('dydu-secondary-actions', classes.actions)}>
          <Button onClick={toggleSecondary(false)} type="button" variant="icon">
            <img alt="Close" src="icons/close.png" title="Close" />
          </Button>
        </div>
        {title && <h1 dangerouslySetInnerHTML={{__html: title}} />}
        {body && <div dangerouslySetInnerHTML={{__html: body}} />}
      </div>
    ) : null;
  }
}


export default withStyles(styles)(Secondary);
