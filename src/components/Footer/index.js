import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Input from '../Input';
import Configuration from '../../tools/configuration';


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    position: 'relative',
    '&&': Configuration.getStyles('footer'),
    [theme.breakpoints.down('xs')]: {'&&': {borderRadius: 0}},
  },
});


class Footer extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  render() {
    const { classes, onRequest, onResponse, ...rest } = this.props;
    return (
      <footer className={classNames('dydu-footer', classes.root)} {...rest}>
        <Input onRequest={onRequest} onResponse={onResponse} />
      </footer>
    );
  }
}


export default withStyles(styles)(Footer);
