import React from 'react';
import ReactDOM from 'react-dom';

import Application from './components/Application';


const root = document.getElementById('dydu-application');
if (root) {
  ReactDOM.render(<Application />, root);
}
