import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Bubble from  '../Bubble';
import Loader from  '../Loader';
import Configuration from  '../../tools/configuration';

import './index.scss';


const loader = Configuration.get('interaction', {}).loader;
const delays = (Array.isArray(loader) ? loader : [loader]).map(it => it === true ? 1000 : ~~it);


class Interaction extends React.PureComponent {

  state = {bubbles: [], length: 0};

  addBubble = (bubbles, index = 0) => {
    if (this.props.thinking) {
      setTimeout(function() {
        this.setState(
          state => ({bubbles: [...state.bubbles, bubbles.shift()]}),
          () => bubbles.length && this.addBubble(bubbles, index + 1),
        );
      }.bind(this), delays[index % delays.length]);
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
    const { avatar, type } = this.props;
    const { bubbles, length } = this.state;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    const configuration = Configuration.get('interaction', {});
    return (
      <div className={classes} ref={node => this.node = node} style={configuration.styles}>
        {!!configuration.avatar && avatar}
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
