import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Avatar from  './Avatar';
import Bubble from  './Bubble';
import Loader from  './Loader';
import Configuration from  '../tools/configuration';


const styles = {
  base: {
    display: 'flex',
    '&:not(:first-child)': {
      paddingTop: '1em',
    },
  },
  bubbles: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  request: {
    marginLeft: '2em',
  },
  response: {
    marginRight: '2em',
  },
};


const LOADER = Configuration.get('interaction.loader');
const DELAYS = (Array.isArray(LOADER) ? LOADER : [LOADER]).map(it => it === true ? 1000 : ~~it);


class Interaction extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    thinking: PropTypes.bool,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  state = {bubbles: [], length: 0};

  addBubble = (bubbles, index = 0) => {
    if (this.props.thinking) {
      setTimeout(function() {
        this.setState(
          state => ({bubbles: [...state.bubbles, bubbles.shift()]}),
          () => bubbles.length && this.addBubble(bubbles, index + 1),
        );
      }.bind(this), DELAYS[index % DELAYS.length]);
    }
    else {
      this.setState(({bubbles: bubbles}));
    }
  };

  mount = () => {
    const interaction = document.createElement('div');
    interaction.innerHTML = this.props.text || '';
    const bubbles = interaction.innerHTML.split('<hr>');
    this.setState(
      ({length: bubbles.length}),
      () => this.addBubble(bubbles),
    );
  };

  componentDidMount() {
    this.mount();
  }

  render() {
    const { classes, type } = this.props;
    const { bubbles, length } = this.state;
    const { avatar } = Configuration.get('interaction');
    return (
      <div className={classNames(
        'dydu-interaction', `dydu-interaction-${type}`, classes.base, classes[type],
      )} ref={node => this.node = node}>
        {!!avatar[type] && <Avatar type={type} />}
        <div className={classNames('dydu-interaction-bubbles', classes.bubbles)}>
          {bubbles.map((it, index) => <Bubble html={it} key={index} type={type} />)}
          {bubbles.length < length && <Loader />}
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Interaction);
