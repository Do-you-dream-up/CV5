import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Configuration from '../../tools/configuration';


const styles = theme => ({
  hidden: {
    '&&': {display: 'none'},
  },
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '1em',
    position: 'absolute',
    right: 0,
    '&&': Configuration.getStyles('teaser'),
  },
});


const TEASER_TITLE = Configuration.get('teaser.title', null);


class Teaser extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const { classes, open, toggle } = this.props;
    return <div children={TEASER_TITLE}
                className={classNames('dydu-teaser', classes.root, {[classes.hidden]: !open})}
                onClick={toggle()} />;
  }
}


export default withStyles(styles)(Teaser);
