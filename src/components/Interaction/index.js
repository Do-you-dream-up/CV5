import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Bubble from  '../Bubble';

import './index.scss';


class Interaction extends React.PureComponent {

  state = {bubbles: []};

  scroll() {
    if (this.props.scroll) {
      ReactDOM.findDOMNode(this).scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }

  componentDidMount() {
    if (this.props.text) {
      const interaction = document.createElement('div');
      interaction.innerHTML = this.props.text || '';
      this.setState(
        () => ({bubbles: [...interaction.innerHTML.split('<hr>')]}),
        this.scroll,
      );
    }
  }

  componentDidUpdate() {
    this.scroll();
  }

  render() {
    const { avatar, children, type } = this.props;
    const { bubbles } = this.state;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    return (
      <div className={classes}>
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


Interaction.propTypes = {
  avatar: PropTypes.object,
  children: PropTypes.node,
  scroll: PropTypes.bool,
  text: PropTypes.string,
  type: PropTypes.string,
};


export default Interaction;
