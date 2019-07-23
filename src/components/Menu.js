import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Configuration from '../tools/configuration';


const styles = theme => ({
  item: {
    cursor: 'pointer',
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  root: {
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.text.primary,
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    paddingBottom: '.5em',
    paddingTop: '.5em',
    position: 'fixed',
    '&&': Configuration.getStyles('menu'),
  },
});


class Menu extends React.PureComponent {

  static propTypes = {
    anchor: PropTypes.instanceOf(Element),
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  getPosition = () => {
    const { offsetHeight: height, offsetWidth: width } = this.ref.current || {};
    return {height, width};
  };

  render() {
    const { anchor, classes, items, open } = this.props;
    // if (anchor) {
    //   style = (({ x: left, y: top }) => ({left, top: top + 40}))(anchor.getBoundingClientRect());
    // }
    const style = this.getPosition(anchor);
    return open && (
      <ul className={classNames('dydu-menu', classes.root)} ref={this.ref} style={style}>
        {items.map((it, index) => (
          <li children={it.text}
              className={classNames('dydu-menu-item', classes.item)}
              key={index}
              onClick={it.onClick}/>
        ))}
      </ul>
    );
  }
}


export default withStyles(styles)(Menu);
