import PropTypes from 'prop-types';
import React from 'react';

import Chatbox from '../Chatbox';
import Teaser from '../Teaser';
import Configuration from '../../tools/configuration';
import Cookie from '../../tools/cookie';
import { withTheme } from '../../theme';

import './index.scss';


class Application extends React.PureComponent {

  state = {open: false};

  toggle = open => () => {
    open = open === undefined ? !this.state.open : !!open;
    this.setState(
      {open: open},
      () => Cookie.set(Cookie.cookies.open, open, Cookie.duration.long),
    );
  };

  componentDidMount() {
    const open = !!Cookie.get(Cookie.cookies.open);
    this.toggle(open === undefined ? !!Configuration.get('application.open') : open)();
  }

  render() {
    const { theme } = this.props;
    const styles = Configuration.getStyles('application', theme);
    return (
      <div className="dydu-application" style={styles}>
        {React.createElement(this.state.open ? Chatbox : Teaser, {toggle: this.toggle})}
      </div>
    );
  }
}


Application.propTypes = {
  theme: PropTypes.object.isRequired,
};


export default withTheme(Application);
