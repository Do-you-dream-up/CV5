import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import { Portal } from 'react-portal';
import styles from './styles';
import Configuration from '../../tools/configuration';


const ROOT = Configuration.get('root');
const SPACING = ~~Configuration.get('menu.spacing');


/**
 * Create a togglable menu, akin to the right-click contextual menu on various
 * systems. The toggle has to be located in the menu children and its `onClick`
 * property will be overwritten.
 */
export default withStyles(styles)(class Menu extends React.PureComponent {

  static propTypes = {
    children: PropTypes.element.isRequired,
    /** @ignore */
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

  /**
   * Handle clicks out of the menu pop-in. Clicks outside of the menu close it.
   *
   * @param {Object} event - DOM event.
   * @public
   */
  onDocumentClick = event => {
    if (!this.anchor.current.contains(event.target) && !this.menu.current.contains(event.target)) {
      this.toggleClose();
    }
  };

  /**
   * Handle clicks on the menu items and close after calling the callback.
   *
   * @param {function} callback - Function to run when the item is selected.
   * @public
   */
  onItemClick = callback => () => {
    if (callback) {
      callback();
      this.toggleClose();
    }
  };

  /**
   * Set the menu position in the viewport. Leave a margin with respect to the
   * limits of the viewport.
   *
   * @public
   */
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

  /**
   * Toggle open or closed the menu.
   *
   * @param {boolean} value - Use `true` to open or `false` to close.
   * @public
   */
  toggle = value => () => {
    value = value === undefined ? !this.state.open : value;
    return value ? this.toggleOpen() : this.toggleClose();
  };

  /**
   * Close the menu.
   *
   * @public
   */
  toggleClose = () => this.setState({open: false}, () => {
    document.removeEventListener('mousedown', this.onDocumentClick);
  });

  /**
   * Open the menu.
   *
   * @public
   */
  toggleOpen = () => this.setState({open: true}, () => {
    this.setGeometry();
    document.addEventListener('mousedown', this.onDocumentClick);
  });

  render() {
    const { children, classes, items } = this.props;
    const { geometry, open } = this.state;
    const node = document && document.getElementById(ROOT);
    return !!items.length && (
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
                    onClick={this.onItemClick(it.onClick)} />
              ))}
            </ul>
          </Portal>
        )}
      </>
    );
  }
});
