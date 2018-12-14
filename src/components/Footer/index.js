import React from 'react';

import Button from '../Button';

import './index.scss';


class Footer extends React.Component {
  render() {
    return (
      <div className="dydu-footer">
        <input className="dydu-footer-input" placeholder="Type here..." type="text" />
        <ul className="dydu-button-actions">
          <li><Button children={<img alt="Send" src="icons/send.png" title="Send"/>} variant="icon" /></li>
        </ul>
      </div>
    );
  }
}


export default Footer;
