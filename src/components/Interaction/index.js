import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Bubble from  '../Bubble';
import Loader from  '../Loader';

import './index.scss';


class Interaction extends React.PureComponent {

  state = {bubbles: [], length: 0};

  addBubble = bubbles => {
    if (this.props.thinking) {
      setTimeout(function() {
        this.setState(
          state => ({bubbles: [...state.bubbles, bubbles.shift()]}),
          () => bubbles.length && this.addBubble(bubbles),
        );
      }.bind(this), 1000);
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
    if (this.props.thinking) {
      setTimeout(this.mount, 250);
    }
    else {
      this.mount();
    }
  }

  render() {
    const { avatar, type } = this.props;
    const { bubbles, length } = this.state;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    return (
      <div className={classes} ref={node => this.node = node}>
        {avatar}
        <div className="dydu-interaction-bubbles">
          {bubbles.map((it, index) => (
            <Bubble dangerouslySetInnerHTML={{__html: it}} key={index} type={type} />
          ))}
          {bubbles.length < length && <Loader />}
        </div>
      </div>
    );
  }
}


Interaction.propTypes = {
  avatar: PropTypes.object,
  text: PropTypes.string.isRequired,
  thinking: PropTypes.bool,
  type: PropTypes.string.isRequired,
};


export default Interaction;
