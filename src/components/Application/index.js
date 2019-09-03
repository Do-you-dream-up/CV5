import classNames from 'classnames';
import PropTypes from 'prop-types';
import qs from 'qs';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Chatbox from '../Chatbox';
import Teaser from '../Teaser';
import Wizard from '../Wizard';
import { withConfiguration } from '../../tools/configuration';
import { Local } from '../../tools/storage';


/**
 * Entry point of the application. Either render the chatbox or the teaser.
 */
export default withConfiguration(withStyles(styles)(class Application extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
  };

  state = {open: false};

  /**
   * Toggle between Teaser and Chatbox views.
   *
   * @param {boolean} [open]
   * @public
   */
  toggle = open => () => {
    open = open === undefined ? !this.state.open : !!open;
    this.setState(
      {open: open},
      () => Local.set(Local.names.open, open),
    );
  };

  componentDidMount() {
    const { open: defaultSetting } = this.props.configuration.application;
    const customSetting = Local.get(Local.names.open);
    this.toggle(customSetting === undefined ? !!defaultSetting : !!customSetting)();
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    const wizard = qs.parse(window.location.search, {ignoreQueryPrefix: true}).wizard !== undefined;
    return (
      <div className={classNames('dydu-application', classes.root)}>
        {wizard && <Wizard />}
        <Chatbox open={open} toggle={this.toggle} />
        <Teaser open={!open} toggle={this.toggle} />
      </div>
    );
  }
}));
