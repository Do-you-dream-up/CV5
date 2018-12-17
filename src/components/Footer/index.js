import React from 'react';

import Button from '../Button';

import './index.scss';


class Footer extends React.PureComponent {
  render() {
    return (
      <div className="dydu-footer">
        <input className="dydu-footer-input" placeholder="Type here..." type="text" />
        <div className="dydu-footer-actions">
          <Button children={<img alt="Send" src="icons/send.png" title="Send" />} variant="icon" />
        </div>
      </div>
    );
  }
}


export default Footer;
