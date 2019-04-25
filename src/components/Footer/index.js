import PropTypes from 'prop-types';
import React from 'react';

import Button from '../Button';
import { withTheme } from '../../theme';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';

import './index.scss';


class Footer extends React.PureComponent {

  state = {input: ''};

  change = event => {
    this.setState({input: event.target.value});
  };

  reset = () => {
    this.setState({input: ''});
  };

  submit = event => {
    event.preventDefault();
    const text = this.state.input.trim();
    if (text) {
      this.reset();
      this.props.onRequest(text);
      dydu.talk(text).then(response => {
        if (response.values) {
          this.props.onResponse(response.values.text);
        }
      });
    }
  };

  render() {
    const { theme } = this.props;
    const styles = {
      input: {
        backgroundColor: theme.palette.primary.light,
        borderRadius: theme.shape.borderRadius,
      },
      root: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.text,
        ...Configuration.getStyles('footer', theme),
      },
    };
    return (
      <form className="dydu-footer" onSubmit={this.submit} style={styles.root}>
        <input autoFocus
               className="dydu-footer-input"
               onChange={this.change}
               placeholder="Type here..."
               style={styles.input}
               type="text"
               value={this.state.input} />
        <div className="dydu-footer-actions">
          <Button children={<img alt="Send" src="icons/send.png" title="Send" />} type="submit" variant="icon" />
        </div>
      </form>
    );
  }
}


Footer.propTypes = {
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};


export default withTheme(Footer);
