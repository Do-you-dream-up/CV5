import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';

import Button from '../Button';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';


const styles = theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },
  input: {
    backgroundColor: theme.palette.primary.light,
    border: 0,
    borderRadius: theme.shape.borderRadius,
    flex: 'auto',
    paddingLeft: '1em',
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    '&&': Configuration.getStyles('footer', theme),
  },
});


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
    const { classes } = this.props;
    return (
      <form className={classNames('dydu-footer', classes.root)} onSubmit={this.submit}>
        <input autoFocus
               className={classNames('dydu-footer-input', classes.input)}
               onChange={this.change}
               placeholder="Type here..."
               type="text"
               value={this.state.input} />
        <div className={classNames('dydu-footer-actions', classes.actions)}>
          <Button children={<img alt="Send" src="icons/send.png" title="Send" />} type="submit" variant="icon" />
        </div>
      </form>
    );
  }
}


Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};


export default withStyles(styles)(Footer);
