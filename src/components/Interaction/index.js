import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import Bubble from  '../Bubble';

import './index.scss';


class Interaction extends React.PureComponent {

  state = {bubbles: []};

  componentDidMount() {
    if (this.props.text) {
      const interaction = document.createElement('div');
      interaction.innerHTML = this.props.text;
      this.setState(state => ({bubbles: [...interaction.innerHTML.split('<hr>')]}));
    }
  }

  componentDidUpdate() {
    if (this.props.last) {
      ReactDOM.findDOMNode(this).scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  render() {
    const { avatar, children, className, last, text, type, ...properties } = this.props;
    const { bubbles } = this.state;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    return (
      <div className={classes} {...properties}>
        {avatar}
        {!!bubbles.length && (
          <div className="dydu-interaction-bubbles">
            {bubbles.map((it, index) => (
              <Bubble dangerouslySetInnerHTML={{__html: it}} key={index} type={type} />
            ))}
          </div>
        )}
        {children}
      </div>
    );
  }
}


export default Interaction;
