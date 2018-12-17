import React from 'react';

import Button from '../Button';

import './index.scss';


class Footer extends React.PureComponent {
  render() {
    return (
      <div className="dydu-footer">
        <input className="dydu-footer-input" placeholder="Type here..." type="text" />
        <div className="dydu-footer-actions">
          <Button variant="icon"><img alt="Send" src="icons/send.png" title="Send" /></Button>
        </div>
      </div>
    );
  }
}


export default Footer;
