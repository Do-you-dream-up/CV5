import React from 'react';
import ReactDOM from 'react-dom';

import Application from './components/Application';
import { ThemeProvider } from './theme';

import './styles/reset.scss';


const root = document.getElementById('dydu-root');
if (root) {
  ReactDOM.render(<ThemeProvider children={<Application />} />, root);
}
