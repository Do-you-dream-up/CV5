import React from 'react';
import ReactDOM from 'react-dom';

import Chatbox from './components/Chatbox';


const root = document.getElementById('dydu-chatbox');
if (root) {
  ReactDOM.render(<Chatbox />, root);
}
