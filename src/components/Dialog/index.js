import React from 'react';

import Interaction from '../Interaction';

import './index.scss';


class Dialog extends React.PureComponent {
  render() {
    const interactions = [
      {type: 'request', text: '<p>Lorem.</p>'},
      {type: 'response', text: '<p>Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales ut.<hr />Amet tellus cras adipiscing enim eu turpis egestas!</p>'
      },
      {type: 'request', text: '<p>Amet tellus cras adipiscing enim eu turpis egestas!</p><p>Feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus, sed?</p>'},
      {type: 'response', text: '<p>Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Amet tellus cras adipiscing enim eu turpis egestas!</p>'},
      {type: 'request', text: '<p>Amet tellus cras adipiscing enim eu turpis egestas!</p><hr><p>Feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus, sed?</p>'},
      {type: 'response', text: '<p>Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales ut.<hr/>Amet tellus cras adipiscing enim eu turpis egestas!</p>'},
    ];
    return (
      <div className="dydu-history">
        {interactions.map((it, index) => <Interaction key={index} text={it.text} type={it.type} />)}
      </div>
    );
  }
}


export default Dialog;
