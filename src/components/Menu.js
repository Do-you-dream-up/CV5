import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import { Portal } from 'react-portal';
import Configuration from '../tools/configuration';


const styles = theme => ({
  item: {
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
    '&:first-child': {marginTop: '.5em'},
    '&:last-child': {marginBottom: '.5em'},
  },
  itemEnabled: {
    cursor: 'pointer',
    '&:hover': {backgroundColor: theme.palette.action.hover},
  },
  itemDisabled: {
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
  },
  root: {
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.text.primary,
    fontFamily: 'sans-serif',
    listStyleType: 'none',
    margin: 0,
    overflowY: 'auto',
    padding: 0,
    position: 'fixed',
    '&&': Configuration.getStyles('menu'),
  },
});


const ROOT = Configuration.get('root');
const SPACING = ~~Configuration.get('menu.spacing');


class Menu extends React.PureComponent {

  static propTypes = {
    children: PropTypes.element.isRequired,
    classes: PropTypes.object.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      onClick: PropTypes.func,
      text: PropTypes.string.isRequired,
    })).isRequired,
  };

  constructor(props) {
    super(props);
    this.anchor = React.createRef();
    this.menu = React.createRef();
    this.state = {geometry: null, open: false};
  }

  setGeometry = () => {
    if (this.menu.current) {
      const anchor = this.anchor.current.getBoundingClientRect();
      const left = anchor.left + anchor.width / 2 - this.menu.current.offsetWidth / 2;
      this.setState({geometry: {
        left: Math.max(0, Math.min(left, window.innerWidth - this.menu.current.offsetWidth - SPACING)),
        maxHeight: window.innerHeight - anchor.bottom - SPACING,
        top: anchor.bottom + SPACING,
      }});
    }
  };

  toggle = value => () => {
    this.setState(
      state => ({open: value === undefined ? !state.open : value}),
      () => (this.state.open && this.setGeometry()),
    );
  };

  render() {
    const { children, classes, items } = this.props;
    const { geometry, open } = this.state;
    const node = document && document.getElementById(ROOT);
    return (
      <>
        {React.cloneElement(children, {onClick: this.toggle(), ref: this.anchor})}
        {open && (
          <Portal node={node}>
            <ul className={classNames('dydu-menu', classes.root)} ref={this.menu} style={geometry}>
              {items.map((it, index) => (
                <li children={it.text}
                    className={classNames(
                      'dydu-menu-item',
                      classes.item,
                      it.onClick ? classes.itemEnabled : classes.itemDisabled
                    )}
                    key={index}
                    onClick={it.onClick}/>
              ))}
            </ul>
          </Portal>
        )}
      </>
    );
  }
}


export default withStyles(styles)(Menu);
