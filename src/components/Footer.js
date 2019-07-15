import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from './Button';
import Input from './Input';
import Configuration from '../tools/configuration';


const styles = theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    position: 'relative',
    '&&': Configuration.getStyles('footer', theme),
  },
});


class Footer extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  render() {
    const { classes, onRequest, onResponse } = this.props;
    return (
      <div className={classNames('dydu-footer', classes.root)}>
        <Input onRequest={onRequest} onResponse={onResponse} />
        <div className={classNames('dydu-footer-actions', classes.actions)}>
          <Button type="submit" variant="icon">
            <img alt="Send" src="icons/send.png" title="Send" />
          </Button>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Footer);
