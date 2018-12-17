import React from 'react';

import Button from '../Button';

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
    if (this.state.input.trim()) {
      this.reset();
      window.dydu.api.talk(this.state.input.trim());
    }
  };

  render() {
    return (
      <form className="dydu-footer" onSubmit={this.submit}>
        <input autoFocus
               className="dydu-footer-input"
               onChange={this.change}
               placeholder="Type here..."
               type="text"
               value={this.state.input} />
        <div className="dydu-footer-actions">
          <Button children={<img alt="Send" src="icons/send.png" title="Send" />} type="submit" variant="icon" />
        </div>
      </form>
    );
  }
}


export default Footer;
