import React from 'react';

import classNames from 'classnames';

import Bubble from  '../Bubble';

import './index.scss';


class Interaction extends React.Component {

  state = {bubbles: []};

  componentDidMount() {
    const interaction = document.createElement('div');
    interaction.innerHTML = this.props.text;
    this.setState(state => ({bubbles: [...interaction.innerHTML.split('<hr>')]}));
  }

  render() {
    const { className, text, type, ...properties } = this.props;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    return (
      <div className={classes} {...properties}>
        <div className="dydu-interaction-avatar"></div>
        <div className="dydu-interaction-bubbles">
          {this.state.bubbles.map((it, index) => (
            <Bubble dangerouslySetInnerHTML={{__html: it}} key={index} type={type} />
          ))}
        </div>
      </div>
    );
  }
}


export default Interaction;
