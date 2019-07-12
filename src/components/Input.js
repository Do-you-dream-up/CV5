import classNames from 'classnames';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Configuration from '../tools/configuration';
import dydu from '../tools/dydu';


const styles = theme => ({
  input: {
    backgroundColor: theme.palette.primary.light,
    border: 0,
    borderRadius: theme.shape.borderRadius,
    flex: 'auto',
    paddingLeft: '1em',
  },
  root: {
    display: 'flex',
    flex: 'auto',
  },
});


const INPUT = Configuration.get('input');
const INPUT_DELAY = INPUT.delay === true ? 1000 : ~~INPUT.delay;


class Input extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  state = {input: ''};

  change = event => {
    this.setState({input: event.target.value});
  };

  onSubmit = event => {
    event.preventDefault();
    return this.submit();
  };

  reset = () => {
    this.setState({input: ''});
  };

  submit = debounce(() => {
    const text = this.state.input.trim();
    if (text) {
      this.reset();
      this.props.onRequest(text);
      dydu.talk(text).then(({ text }) => {
        if (text) {
          this.props.onResponse(text);
        }
      });
    }
  }, 200, {leading: true});

  suggest = debounce(() => {
    const text = this.state.input.trim();
    if (text) {
      dydu.suggest(text).then(suggestions => {
        if (Array.isArray(suggestions)) {
          this.setState({suggestions});
        }
      });
    }
  }, INPUT_DELAY);

  render() {
    const { classes } = this.props;
    return (
      <form className={classNames('dydu-input', classes.root)} onSubmit={this.onSubmit}>
        <input autoFocus
               className={classes.input}
               onChange={this.change}
               placeholder="Type here..."
               type="text"
               value={this.state.input} />
      </form>
    );
  }
}


export default withStyles(styles)(Input);
